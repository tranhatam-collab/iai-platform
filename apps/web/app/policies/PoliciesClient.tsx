// ═══════════════════════════════════════════════════════════════
//  IAI PoliciesClient — Tabs for ToS, Privacy, Copyright
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type PolicyTab = 'terms' | 'privacy' | 'copyright'

const TABS: { id: PolicyTab; label: string; icon: string }[] = [
  { id: 'terms',     label: 'Điều khoản', icon: '📜' },
  { id: 'privacy',   label: 'Bảo mật',    icon: '🔒' },
  { id: 'copyright', label: 'Bản quyền',  icon: '⛓'  },
]

// ── TOC Sidebar ───────────────────────────────────────────────
type TocItem = { id: string; label: string; level: 1 | 2 }

const TERMS_TOC: TocItem[] = [
  { id: 'terms-1',  label: '1. Giới thiệu nền tảng',         level: 1 },
  { id: 'terms-2',  label: '2. Tài khoản người dùng',         level: 1 },
  { id: 'terms-3',  label: '3. Trách nhiệm nội dung',         level: 1 },
  { id: 'terms-4',  label: '4. Nội dung bị nghiêm cấm',       level: 1 },
  { id: 'terms-5',  label: '5. Creators và bán nội dung',     level: 1 },
  { id: 'terms-6',  label: '6. Quyền của IAI',                level: 1 },
  { id: 'terms-7',  label: '7. Chấm dứt tài khoản',          level: 1 },
  { id: 'terms-8',  label: '8. Giới hạn trách nhiệm',        level: 1 },
  { id: 'terms-9',  label: '9. Thay đổi điều khoản',         level: 1 },
]

const PRIVACY_TOC: TocItem[] = [
  { id: 'privacy-1', label: '1. Thông tin thu thập',           level: 1 },
  { id: 'privacy-2', label: '2. Cách sử dụng dữ liệu',         level: 1 },
  { id: 'privacy-3', label: '3. Không bán dữ liệu',            level: 1 },
  { id: 'privacy-4', label: '4. Lưu trữ dữ liệu',             level: 1 },
  { id: 'privacy-5', label: '5. Quyền của người dùng',         level: 1 },
  { id: 'privacy-6', label: '6. Cookies',                      level: 1 },
  { id: 'privacy-7', label: '7. Bảo mật',                      level: 1 },
  { id: 'privacy-8', label: '8. Liên hệ',                      level: 1 },
]

const COPYRIGHT_TOC: TocItem[] = [
  { id: 'copy-1', label: '1. Bảo vệ tự động',                  level: 1 },
  { id: 'copy-2', label: '2. Đăng ký on-chain',                level: 1 },
  { id: 'copy-3', label: '3. Báo cáo vi phạm',                 level: 1 },
  { id: 'copy-4', label: '4. Quy trình xử lý',                 level: 1 },
  { id: 'copy-5', label: '5. Hậu quả vi phạm',                 level: 1 },
  { id: 'copy-6', label: '6. Kháng cáo',                       level: 1 },
]

const TOC_MAP: Record<PolicyTab, TocItem[]> = {
  terms:     TERMS_TOC,
  privacy:   PRIVACY_TOC,
  copyright: COPYRIGHT_TOC,
}

function TocSidebar({ items, active }: { items: TocItem[]; active: string }) {
  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="space-y-0.5">
      {items.map(item => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-150',
            item.level === 2 ? 'pl-6' : '',
            active === item.id
              ? 'bg-gold/10 text-gold font-medium'
              : 'text-white/40 hover:text-white/70 hover:bg-obsidian-light'
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

// ── Section Heading ───────────────────────────────────────────
function SectionH2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="font-serif text-xl text-gold mt-10 mb-4 scroll-mt-24 pb-2 border-b border-gold/15"
    >
      {children}
    </h2>
  )
}

function SectionH3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-base text-white/90 mt-6 mb-2">
      {children}
    </h3>
  )
}

function Para({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-white/60 leading-relaxed mb-3">{children}</p>
}

function UList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 mb-4 ml-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-white/55">
          <span className="text-gold/50 mt-0.5 shrink-0">·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function InfoBox({ children, variant = 'gold' }: { children: React.ReactNode; variant?: 'gold' | 'jade' | 'cyan' }) {
  const styles = {
    gold: 'bg-gold/5 border-gold/20 text-gold/80',
    jade: 'bg-jade/5 border-jade/20 text-jade/80',
    cyan: 'bg-cyan-iai/5 border-cyan-iai/20 text-cyan-iai/80',
  }
  return (
    <div className={cn('rounded-xl border p-4 my-4 text-sm leading-relaxed', styles[variant])}>
      {children}
    </div>
  )
}

// ── Terms Content ─────────────────────────────────────────────
function TermsContent() {
  return (
    <article className="prose-iai max-w-none">
      <div className="mb-8">
        <p className="text-xs text-white/30 font-mono">Cập nhật lần cuối: Tháng 3, 2026</p>
      </div>

      <InfoBox variant="gold">
        Bằng việc sử dụng nền tảng IAI, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi tham gia.
      </InfoBox>

      <SectionH2 id="terms-1">1. Giới thiệu nền tảng</SectionH2>
      <Para>
        IAI (Intelligence · Artistry · International) là nền tảng giáo dục cộng đồng phi tập trung,
        nơi mọi thông tin được kiểm chứng bởi AI và lưu trữ một cách minh bạch. Chúng tôi cung cấp
        môi trường học tập, trao đổi và chia sẻ tri thức với sự thật là nền tảng cốt lõi.
      </Para>
      <Para>
        Nền tảng bao gồm: mạng xã hội giáo dục, kho bài học, marketplace khóa học và tài liệu,
        hệ thống kiểm chứng nội dung bằng AI, và hạ tầng lưu trữ phi tập trung (Phase 3).
      </Para>

      <SectionH2 id="terms-2">2. Tài khoản người dùng</SectionH2>
      <Para>Để tham gia đầy đủ vào nền tảng IAI, bạn cần:</Para>
      <UList items={[
        'Cung cấp địa chỉ email hợp lệ và thông tin chính xác khi đăng ký.',
        'Chịu trách nhiệm bảo mật mật khẩu và tài khoản của mình.',
        'Không sử dụng tài khoản của người khác hoặc tạo nhiều tài khoản để lách quy tắc.',
        'Thông báo ngay cho IAI nếu phát hiện truy cập trái phép vào tài khoản.',
        'Handle (@username) phải lịch sự và không vi phạm nhãn hiệu của bên thứ ba.',
      ]} />

      <SectionH2 id="terms-3">3. Trách nhiệm nội dung</SectionH2>
      <Para>
        Người dùng hoàn toàn chịu trách nhiệm đối với mọi nội dung mà mình đăng tải, bao gồm
        bài viết, bình luận, bài học, khóa học và tài liệu. IAI không kiểm duyệt trước mọi
        nội dung nhưng áp dụng hệ thống AI kiểm chứng tự động và cơ chế báo cáo cộng đồng.
      </Para>
      <Para>
        Bằng việc đăng tải nội dung, bạn cam kết rằng nội dung đó không vi phạm quyền sở hữu trí tuệ
        của bất kỳ bên thứ ba nào, và bạn có đầy đủ quyền để chia sẻ nội dung đó trên nền tảng.
      </Para>

      <SectionH2 id="terms-4">4. Nội dung bị nghiêm cấm</SectionH2>
      <Para>Các hành vi sau đây bị nghiêm cấm và có thể dẫn đến xóa nội dung hoặc khóa tài khoản:</Para>
      <UList items={[
        'Đăng tải thông tin sai lệch cố ý nhằm gây hiểu lầm hoặc gây hại.',
        'Vi phạm bản quyền: sao chép, phân phối tác phẩm có bản quyền mà không được phép.',
        'Spam: đăng nội dung lặp lại, quảng cáo không liên quan, hoặc tự động hóa tương tác.',
        'Nội dung thù địch, kỳ thị dựa trên chủng tộc, giới tính, tôn giáo hoặc xu hướng tình dục.',
        'Nội dung khiêu dâm, bạo lực hoặc khai thác trẻ em dưới mọi hình thức.',
        'Cố tình cung cấp thông tin giả mạo về danh tính hoặc trình độ chuyên môn.',
        'Phishing, tấn công kỹ thuật xã hội, hoặc phân phối phần mềm độc hại.',
        'Mua bán tài khoản, điểm tín nhiệm, hoặc các chỉ số uy tín giả tạo.',
      ]} />

      <SectionH2 id="terms-5">5. Creators và bán nội dung</SectionH2>
      <Para>
        Creators có thể đăng bán khóa học và tài liệu trên IAI Marketplace. Khi tham gia chương trình Creator, bạn đồng ý:
      </Para>
      <UList items={[
        'Đảm bảo 100% quyền sở hữu trí tuệ đối với nội dung bán ra.',
        'Cung cấp nội dung chất lượng, chính xác và có giá trị giáo dục thực sự.',
        'Không bán nội dung đã được bán trên nền tảng khác mà vi phạm điều khoản độc quyền (nếu có).',
        'Chấp nhận chính sách chia sẻ doanh thu: IAI giữ lại 20% trên mỗi giao dịch thành công.',
        'Phản hồi khiếu nại của học viên trong vòng 3 ngày làm việc.',
        'Cập nhật nội dung khóa học khi có thông tin đã lỗi thời hoặc sai lệch.',
      ]} />

      <InfoBox variant="jade">
        <strong>Chính sách hoàn tiền:</strong> Học viên có quyền yêu cầu hoàn tiền trong vòng 7 ngày
        sau khi mua, với điều kiện chưa hoàn thành quá 20% khóa học. IAI sẽ xử lý hoàn tiền trong 5 ngày làm việc.
      </InfoBox>

      <SectionH2 id="terms-6">6. Quyền của IAI</SectionH2>
      <Para>IAI bảo lưu quyền:</Para>
      <UList items={[
        'Xóa hoặc ẩn nội dung vi phạm sau khi xác minh qua hệ thống AI và đội ngũ kiểm duyệt.',
        'Điều chỉnh điểm tín nhiệm (trust score) dựa trên chất lượng nội dung và phản hồi cộng đồng.',
        'Tạm khóa tài khoản trong quá trình điều tra vi phạm nghiêm trọng.',
        'Thay đổi tính năng, giao diện và chính sách của nền tảng theo thời gian.',
        'Từ chối cấp phép hoặc thu hồi tư cách Creator nếu vi phạm điều khoản.',
      ]} />

      <SectionH2 id="terms-7">7. Chấm dứt tài khoản</SectionH2>
      <Para>
        Tài khoản vi phạm nghiêm trọng các điều khoản sử dụng, đặc biệt là đăng thông tin sai lệch
        cố ý gây hại cộng đồng, vi phạm bản quyền quy mô lớn, hoặc có hành vi lừa đảo, sẽ bị
        <strong className="text-white"> khóa vĩnh viễn</strong> mà không cần thông báo trước.
      </Para>
      <Para>
        Người dùng cũng có quyền xóa tài khoản của mình bất cứ lúc nào. Nội dung đã đăng sẽ được
        ẩn danh hóa và giữ lại trong 30 ngày trước khi xóa hoàn toàn, để bảo vệ tính toàn vẹn của
        các cuộc thảo luận liên quan.
      </Para>

      <SectionH2 id="terms-8">8. Giới hạn trách nhiệm</SectionH2>
      <Para>
        IAI cung cấp nền tảng dưới dạng "nguyên trạng" (as-is). Chúng tôi không chịu trách nhiệm
        về độ chính xác tuyệt đối của nội dung do người dùng tạo ra, sự gián đoạn dịch vụ do
        sự cố kỹ thuật ngoài tầm kiểm soát, hoặc thiệt hại gián tiếp phát sinh từ việc sử dụng nền tảng.
      </Para>

      <SectionH2 id="terms-9">9. Thay đổi điều khoản</SectionH2>
      <Para>
        IAI có thể cập nhật điều khoản này theo thời gian. Thay đổi quan trọng sẽ được thông báo
        qua email và thông báo trong ứng dụng ít nhất 14 ngày trước khi có hiệu lực. Việc tiếp tục
        sử dụng nền tảng sau ngày có hiệu lực đồng nghĩa với việc bạn chấp nhận điều khoản mới.
      </Para>

      <Para>
        Mọi thắc mắc về điều khoản sử dụng, vui lòng liên hệ:{' '}
        <a href="mailto:legal@iai.one" className="text-gold hover:text-gold-light underline">
          legal@iai.one
        </a>
      </Para>
    </article>
  )
}

// ── Privacy Content ───────────────────────────────────────────
function PrivacyContent() {
  return (
    <article className="prose-iai max-w-none">
      <div className="mb-8">
        <p className="text-xs text-white/30 font-mono">Cập nhật lần cuối: Tháng 3, 2026</p>
      </div>

      <InfoBox variant="cyan">
        IAI cam kết bảo vệ quyền riêng tư của bạn. Chúng tôi chỉ thu thập dữ liệu cần thiết để
        vận hành nền tảng và <strong>tuyệt đối không bán dữ liệu</strong> cho bên thứ ba.
      </InfoBox>

      <SectionH2 id="privacy-1">1. Thông tin thu thập</SectionH2>
      <Para>Chúng tôi thu thập các loại thông tin sau khi bạn sử dụng IAI:</Para>

      <SectionH3>Thông tin bạn cung cấp trực tiếp</SectionH3>
      <UList items={[
        'Địa chỉ email (dùng để xác thực và thông báo quan trọng).',
        'Handle (@username), tên hiển thị và ảnh đại diện.',
        'Tiểu sử, vị trí địa lý, liên kết website (nếu bạn tự điền).',
        'Nội dung bạn đăng tải: bài viết, bình luận, bài học, khóa học, tài liệu.',
        'Thông tin thanh toán (chỉ lưu token mã hóa, không lưu số thẻ).',
      ]} />

      <SectionH3>Thông tin thu thập tự động</SectionH3>
      <UList items={[
        'Lịch sử học tập: các bài học, khóa học bạn đã xem và tiến độ hoàn thành.',
        'Tương tác: bài viết bạn thích, bình luận, theo dõi.',
        'Thiết bị và trình duyệt: loại thiết bị, hệ điều hành (để tối ưu trải nghiệm).',
        'Địa chỉ IP (để phát hiện gian lận và bảo mật tài khoản).',
      ]} />

      <SectionH2 id="privacy-2">2. Cách sử dụng dữ liệu</SectionH2>
      <Para>Dữ liệu thu thập được sử dụng cho:</Para>
      <UList items={[
        'Vận hành và cải thiện dịch vụ IAI.',
        'Cá nhân hóa nội dung đề xuất dựa trên lịch sử học tập.',
        'Chạy hệ thống AI kiểm chứng nội dung (fact-checking tự động).',
        'Gửi thông báo quan trọng về tài khoản và cập nhật dịch vụ.',
        'Phát hiện và ngăn chặn lạm dụng, gian lận trên nền tảng.',
        'Phân tích tổng hợp (anonymized) để cải thiện sản phẩm.',
      ]} />

      <SectionH2 id="privacy-3">3. Cam kết không bán dữ liệu</SectionH2>
      <Para>
        IAI <strong className="text-white">không bán, không cho thuê, và không trao đổi</strong> dữ liệu
        cá nhân của người dùng cho bất kỳ bên thứ ba nào vì mục đích thương mại.
      </Para>
      <Para>
        Dữ liệu chỉ được chia sẻ trong các trường hợp: (1) bạn đã đồng ý rõ ràng, (2) yêu cầu
        pháp lý từ cơ quan có thẩm quyền, (3) cần thiết để vận hành dịch vụ qua nhà cung cấp
        hạ tầng đáng tin cậy (Cloudflare, với cam kết bảo mật nghiêm ngặt).
      </Para>

      <SectionH2 id="privacy-4">4. Lưu trữ dữ liệu</SectionH2>
      <Para>
        Dữ liệu của bạn được lưu trữ trên <strong className="text-white">Cloudflare D1</strong> —
        cơ sở dữ liệu phân tán tại edge nodes trên toàn thế giới, với mã hóa AES-256 cho dữ liệu
        tĩnh và TLS 1.3 cho dữ liệu truyền tải.
      </Para>
      <UList items={[
        'Dữ liệu tài khoản được lưu trữ vô thời hạn cho đến khi bạn yêu cầu xóa.',
        'Log hoạt động được lưu trong 90 ngày, sau đó tự động xóa.',
        'Nội dung đã xóa được gỡ khỏi hệ thống trong 30 ngày.',
        'Bản sao lưu (backup) được mã hóa và lưu trữ trong 30 ngày.',
      ]} />

      <InfoBox variant="jade">
        Với Phase 3 (blockchain integration), một số nội dung bạn chọn đăng ký bản quyền
        sẽ được lưu trữ trên IPFS — không thể xóa sau khi đã đăng ký. Bạn sẽ được thông báo
        rõ ràng trước khi thực hiện bất kỳ hành động không thể hoàn tác nào.
      </InfoBox>

      <SectionH2 id="privacy-5">5. Quyền của người dùng</SectionH2>
      <Para>Bạn có các quyền sau đối với dữ liệu của mình:</Para>
      <UList items={[
        'Quyền truy cập: yêu cầu bản sao toàn bộ dữ liệu IAI thu thập về bạn.',
        'Quyền chỉnh sửa: cập nhật thông tin cá nhân bất cứ lúc nào trong cài đặt tài khoản.',
        'Quyền xóa: yêu cầu xóa tài khoản và toàn bộ dữ liệu liên quan.',
        'Quyền hạn chế: yêu cầu ngừng sử dụng dữ liệu của bạn cho mục đích cụ thể.',
        'Quyền di chuyển dữ liệu: xuất dữ liệu theo định dạng JSON.',
      ]} />
      <Para>
        Để thực hiện các quyền trên, gửi yêu cầu đến{' '}
        <a href="mailto:privacy@iai.one" className="text-gold hover:text-gold-light underline">
          privacy@iai.one
        </a>
        . Chúng tôi sẽ phản hồi trong vòng 30 ngày.
      </Para>

      <SectionH2 id="privacy-6">6. Cookies</SectionH2>
      <Para>IAI chỉ sử dụng cookies cho các mục đích cần thiết:</Para>
      <UList items={[
        'Cookie phiên đăng nhập (session): duy trì trạng thái đăng nhập, tự động hết hạn sau 30 ngày.',
        'Cookie tùy chọn giao diện: lưu cài đặt theme, ngôn ngữ.',
        'Cookie bảo mật: bảo vệ chống CSRF và tấn công giả mạo yêu cầu.',
      ]} />
      <Para>
        <strong className="text-white">Chúng tôi không sử dụng cookie theo dõi quảng cáo</strong> (tracking cookies)
        hay chia sẻ cookie với mạng quảng cáo bên thứ ba.
      </Para>

      <SectionH2 id="privacy-7">7. Bảo mật</SectionH2>
      <Para>
        IAI áp dụng các biện pháp bảo mật tiêu chuẩn ngành bao gồm: mã hóa mật khẩu bằng bcrypt,
        xác thực JWT an toàn, HTTPS cho tất cả kết nối, giới hạn tốc độ API để ngăn brute force,
        và giám sát bất thường 24/7.
      </Para>

      <SectionH2 id="privacy-8">8. Liên hệ</SectionH2>
      <Para>
        Mọi thắc mắc về chính sách bảo mật, vui lòng liên hệ Đội ngũ Bảo mật IAI:
      </Para>
      <UList items={[
        'Email: privacy@iai.one',
        'Thời gian phản hồi: 3-5 ngày làm việc',
        'Địa chỉ: IAI — Hiệp Hội Trí Tuệ Sáng Tạo Toàn Cầu',
      ]} />
    </article>
  )
}

// ── Copyright Content ─────────────────────────────────────────
function CopyrightContent() {
  return (
    <article className="prose-iai max-w-none">
      <div className="mb-8">
        <p className="text-xs text-white/30 font-mono">Cập nhật lần cuối: Tháng 3, 2026</p>
      </div>

      <InfoBox variant="gold">
        IAI tin rằng mọi sáng tạo đều xứng đáng được bảo vệ. Chúng tôi xây dựng hệ thống bảo vệ
        bản quyền minh bạch, phi tập trung, và công bằng cho tất cả creators.
      </InfoBox>

      <SectionH2 id="copy-1">1. Bảo vệ tự động</SectionH2>
      <Para>
        Mọi nội dung gốc được đăng tải trên IAI đều được bảo vệ bản quyền tự động ngay khi tạo ra,
        theo quy định của Luật Sở hữu trí tuệ Việt Nam (Luật số 36/2009/QH12 và các sửa đổi bổ sung).
      </Para>
      <Para>
        Hệ thống IAI tự động tạo <strong className="text-white">content hash</strong> (SHA-256)
        cho mỗi bài viết, bài học và nội dung khóa học, ghi nhận thời điểm tạo ra và lưu trữ
        trong cơ sở dữ liệu có thể kiểm tra được.
      </Para>
      <UList items={[
        'Hash được tạo ngay khi nội dung được lưu, trước khi xuất bản.',
        'Metadata bao gồm: user ID, timestamp, content hash, độ dài nội dung.',
        'Bằng chứng số có thể được xuất ra để dùng trong tranh chấp pháp lý.',
      ]} />

      <SectionH2 id="copy-2">2. Đăng ký on-chain (Phase 3)</SectionH2>
      <Para>
        Trong giai đoạn Phase 3, creators có thể nâng cấp bảo vệ bản quyền bằng cách đăng ký
        nội dung lên blockchain thông qua hệ thống IAI Copyright Registry.
      </Para>
      <UList items={[
        'Content hash sẽ được ghi vào smart contract trên mạng blockchain công khai.',
        'IPFS CID (Content Identifier) lưu trữ bản sao bất biến của nội dung.',
        'NFT bản quyền (Copyright NFT) được phát hành cho creator như bằng chứng sở hữu.',
        'Toàn bộ lịch sử giao dịch có thể xem công khai và không thể giả mạo.',
      ]} />

      <InfoBox variant="cyan">
        <strong>Lưu ý quan trọng:</strong> Đăng ký on-chain là hành động không thể hoàn tác. Một khi
        content hash đã được ghi lên blockchain, nó tồn tại vĩnh viễn. Hãy đảm bảo nội dung đã
        hoàn thiện trước khi thực hiện.
      </InfoBox>

      <SectionH2 id="copy-3">3. Báo cáo vi phạm</SectionH2>
      <Para>
        Nếu bạn phát hiện nội dung trên IAI vi phạm bản quyền của mình, hãy gửi báo cáo vi phạm
        theo quy trình DMCA-inspired của chúng tôi:
      </Para>
      <UList items={[
        'Gửi email đến copyright@iai.one với tiêu đề "[BẢN QUYỀN] Báo cáo vi phạm".',
        'Cung cấp: liên kết đến nội dung gốc của bạn và liên kết đến nội dung vi phạm.',
        'Mô tả rõ ràng nội dung nào bị vi phạm và cách vi phạm xảy ra.',
        'Xác nhận bạn là chủ sở hữu bản quyền hoặc đại diện được ủy quyền.',
        'Cung cấp thông tin liên hệ để IAI có thể phản hồi.',
      ]} />
      <Para>
        Email báo cáo:{' '}
        <a href="mailto:copyright@iai.one" className="text-gold hover:text-gold-light underline">
          copyright@iai.one
        </a>
      </Para>

      <SectionH2 id="copy-4">4. Quy trình xử lý</SectionH2>
      <Para>
        Sau khi nhận được báo cáo vi phạm hợp lệ, IAI cam kết xử lý theo quy trình sau:
      </Para>
      <div className="space-y-3 my-4">
        {[
          { day: 'Ngày 1',   step: 'Tiếp nhận và xác nhận báo cáo qua email tự động.' },
          { day: 'Ngày 1-3', step: 'Đội ngũ kiểm duyệt xem xét nội dung được báo cáo.' },
          { day: 'Ngày 3-5', step: 'Liên hệ người đăng nội dung bị báo cáo để nghe giải trình.' },
          { day: 'Ngày 5-7', step: 'Đưa ra quyết định cuối cùng và thông báo cho cả hai bên.' },
        ].map(({ day, step }) => (
          <div key={day} className="flex items-start gap-3 card p-3">
            <span className="badge badge-gold font-mono text-[10px] shrink-0 mt-0.5">{day}</span>
            <p className="text-sm text-white/60">{step}</p>
          </div>
        ))}
      </div>
      <Para>
        Tổng thời gian xử lý tối đa: <strong className="text-white">7 ngày làm việc</strong> kể từ
        khi nhận báo cáo đầy đủ thông tin.
      </Para>

      <SectionH2 id="copy-5">5. Hậu quả vi phạm</SectionH2>
      <Para>Tùy mức độ vi phạm, IAI áp dụng các biện pháp sau:</Para>
      <UList items={[
        'Vi phạm lần đầu (nhẹ): cảnh báo và yêu cầu gỡ nội dung vi phạm trong 48 giờ.',
        'Không tuân thủ sau cảnh báo: IAI chủ động gỡ nội dung và ghi nhận vi phạm.',
        'Vi phạm lần 2: đình chỉ tài khoản tạm thời (7-30 ngày), đồng thời gỡ nội dung.',
        'Vi phạm nghiêm trọng hoặc lần 3+: khóa tài khoản vĩnh viễn, không hoàn lại số dư.',
        'Creator vi phạm: bị thu hồi tư cách Creator và tất cả nội dung trong Marketplace.',
      ]} />

      <SectionH2 id="copy-6">6. Kháng cáo</SectionH2>
      <Para>
        Nếu bạn nhận được thông báo gỡ nội dung và cho rằng đó là quyết định sai, bạn có thể
        nộp kháng cáo trong vòng 14 ngày kể từ ngày nhận thông báo.
      </Para>
      <Para>
        Gửi kháng cáo đến{' '}
        <a href="mailto:copyright@iai.one" className="text-gold hover:text-gold-light underline">
          copyright@iai.one
        </a>{' '}
        với tiêu đề "[KHÁNG CÁO]" và bằng chứng chứng minh bạn có quyền sử dụng nội dung đó.
        Kháng cáo sẽ được xem xét trong 7 ngày làm việc.
      </Para>

      <InfoBox variant="gold">
        IAI cam kết xử lý công bằng cho tất cả các bên. Nếu kháng cáo thành công, nội dung sẽ được
        khôi phục và lịch sử vi phạm sẽ được xóa khỏi hồ sơ tài khoản của bạn.
      </InfoBox>
    </article>
  )
}

// ── Main Client Component ─────────────────────────────────────
export function PoliciesClient() {
  const [activeTab, setActiveTab] = useState<PolicyTab>('terms')
  const currentToc = TOC_MAP[activeTab]

  return (
    <div className="min-h-screen bg-obsidian">

      {/* ── Hero ─── */}
      <section className="border-b border-obsidian-border bg-obsidian-mid">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge badge-gold font-mono text-[10px]">✦ IAI LEGAL</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-white mb-2">
            Chính sách & Điều khoản
          </h1>
          <p className="text-sm text-white/45 max-w-xl">
            Minh bạch là giá trị cốt lõi của IAI. Chúng tôi cam kết bảo vệ quyền lợi người dùng
            với các chính sách rõ ràng và công bằng.
          </p>
        </div>
      </section>

      {/* ── Tabs ─── */}
      <div className="sticky top-16 z-30 bg-obsidian/90 backdrop-blur-xl border-b border-obsidian-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 py-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-obsidian-light text-white border border-obsidian-border'
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ─── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">

          {/* ── TOC Sidebar ─── */}
          <aside className="hidden lg:block sticky top-32">
            <div className="card p-4">
              <h3 className="text-[10px] text-white/30 font-mono uppercase tracking-widest mb-3 px-3">
                Nội dung
              </h3>
              <TocSidebar items={currentToc} active="" />
            </div>
          </aside>

          {/* ── Main Content ─── */}
          <main className="card p-6 sm:p-8 min-w-0 animate-in">
            {activeTab === 'terms'     && <TermsContent />}
            {activeTab === 'privacy'   && <PrivacyContent />}
            {activeTab === 'copyright' && <CopyrightContent />}

            {/* Footer */}
            <div className="mt-12 pt-6 border-t border-obsidian-border">
              <p className="text-xs text-white/25 font-mono text-center">
                © 2026 IAI — Intelligence · Artistry · International · iai.one
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
