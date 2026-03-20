// ═══════════════════════════════════════════════════════════════
//  IAI AI Engine — Claude-powered fact-checking & lesson gen
//  Model: claude-sonnet-4-6 (latest Claude Sonnet)
// ═══════════════════════════════════════════════════════════════

import type { FactCheckResult, Claim } from '../types'

const CLAUDE_API = 'https://api.anthropic.com/v1/messages'
const MODEL      = 'claude-sonnet-4-6'

// ── Fact-Check ───────────────────────────────────────────────

const FACT_CHECK_SYSTEM = `Bạn là IAI Verify Bot — AI kiểm chứng sự thật của nền tảng IAI.one.

NHIỆM VỤ: Phân tích nội dung do người dùng gửi, xác định các luận điểm có thể kiểm chứng được, và đánh giá tính chính xác dựa trên kiến thức đã học.

LUÔN trả về JSON hợp lệ theo schema sau:
{
  "status": "verified" | "disputed" | "unverified" | "opinion" | "false",
  "truth_score": <0-100>,
  "summary": "<tóm tắt ngắn bằng tiếng Việt>",
  "claims": [
    {
      "text": "<luận điểm cụ thể>",
      "verdict": "true" | "false" | "unclear" | "opinion",
      "confidence": <0-100>,
      "explanation": "<giải thích ngắn gọn>",
      "source_url": "<URL nguồn nếu có>"
    }
  ],
  "sources": ["<nguồn 1>", "<nguồn 2>"],
  "recommendation": "<lời khuyên cho người đọc>"
}

NGUYÊN TẮC:
- Khách quan, không thiên vị chính trị
- Luôn phân biệt FACT (sự kiện có thể kiểm chứng) vs OPINION (quan điểm cá nhân)
- Nếu không đủ thông tin, trả về "unverified" không phải "false"
- truth_score: 90-100=verified, 70-89=mostly true, 50-69=disputed, <50=false/misleading`

export async function factCheck(content: string, apiKey: string): Promise<FactCheckResult> {
  const start = Date.now()

  const response = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/json',
      'x-api-key':      apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1500,
      system: FACT_CHECK_SYSTEM,
      messages: [{ role: 'user', content: `Kiểm chứng nội dung sau:\n\n"${content}"` }],
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Claude API error ${response.status}: ${err}`)
  }

  const data = await response.json() as { content: Array<{ text: string }> }
  const text  = data.content[0]?.text ?? ''

  // Parse JSON from Claude response (may be wrapped in markdown)
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? text.match(/(\{[\s\S]*\})/)
  const jsonStr   = jsonMatch?.[1] ?? text

  let result: Omit<FactCheckResult, 'processing_ms' | 'model_used'>
  try {
    result = JSON.parse(jsonStr)
  } catch {
    // Fallback if Claude returns malformed JSON
    result = {
      status:         'unverified',
      truth_score:    50,
      summary:        'Không thể phân tích tự động. Vui lòng xem xét thủ công.',
      claims:         [],
      sources:        [],
      recommendation: 'Cần xác minh thêm từ nguồn đáng tin cậy.',
    }
  }

  return { ...result, processing_ms: Date.now() - start, model_used: MODEL }
}

// ── Content Quality Scorer ───────────────────────────────────

export async function scoreContent(
  content: string,
  env: { ANTHROPIC_API_KEY: string }
): Promise<{ score: number; summary: string }> {
  const response = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: `Đánh giá chất lượng nội dung giáo dục sau theo thang 0-100. Tiêu chí: độ rõ ràng, chính xác, có ví dụ, cấu trúc tốt. Trả về JSON: {"score": <số>, "summary": "<nhận xét ngắn tiếng Việt>"}\n\nNội dung:\n${content.slice(0, 1200)}`,
      }],
    }),
  })
  if (!response.ok) return { score: 0, summary: 'Không thể đánh giá tự động' }
  const data = await response.json() as { content: Array<{ text: string }> }
  const text = data.content[0]?.text ?? '{}'
  const m = text.match(/\{[\s\S]*\}/)
  try { return JSON.parse(m?.[0] ?? '{}') } catch { return { score: 0, summary: '' } }
}

// ── Lesson Generator ─────────────────────────────────────────

const LESSON_SYSTEM = `Bạn là IAI Mind — AI tạo bài học cho nền tảng IAI.one.

Tạo bài học CHẤT LƯỢNG CAO bằng tiếng Việt theo format Markdown.
Bài học phải:
1. Chính xác về mặt khoa học, có nguồn dẫn
2. Phù hợp với trình độ được yêu cầu
3. Có ví dụ thực tế gần gũi với người Việt Nam
4. Kết thúc với câu hỏi thảo luận

Trả về JSON:
{
  "title": "<tiêu đề bài học>",
  "slug": "<url-slug-không-dấu>",
  "summary": "<tóm tắt 2-3 câu>",
  "content_md": "<nội dung Markdown đầy đủ>",
  "key_concepts": ["<khái niệm 1>", "<khái niệm 2>"],
  "sources": ["<nguồn 1>", "<nguồn 2>"],
  "estimated_minutes": <số phút đọc>
}`

export async function generateLesson(
  topic: string,
  level: string,
  language: string,
  apiKey: string
): Promise<{ title: string; slug: string; summary: string; content_md: string; key_concepts: string[]; sources: string[]; estimated_minutes: number }> {

  const response = await fetch(CLAUDE_API, {
    method: 'POST',
    headers: {
      'Content-Type':   'application/json',
      'x-api-key':      apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: LESSON_SYSTEM,
      messages: [{
        role: 'user',
        content: `Tạo bài học về chủ đề: "${topic}"\nTrình độ: ${level}\nNgôn ngữ: ${language}`,
      }],
    }),
  })

  if (!response.ok) throw new Error(`Claude API error ${response.status}`)

  const data = await response.json() as { content: Array<{ text: string }> }
  const text  = data.content[0]?.text ?? ''
  const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) ?? text.match(/(\{[\s\S]*\})/)

  return JSON.parse(jsonMatch?.[1] ?? text)
}
