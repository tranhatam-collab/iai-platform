# CLOUDFLARE_WORKERS_FULL_BACKEND.md
## IAI — Production Backend (Cloudflare Workers)
## Version 1.0

---

# 0. GOAL

Deploy backend globally:
- serverless
- low latency
- scalable
- secure

---

# 1. FILE STRUCTURE

/workers  
index.ts  
routes/  
auth.ts  
checkin.ts  
flow.ts  
run.ts  
proof.ts  
lib/  
db.ts  
auth.ts  
hash.ts  

---

# 2. MAIN ENTRY (`index.ts`)

```ts
import { Router } from "itty-router";
import { handleCheckin } from "./routes/checkin";

const router = Router();

router.post("/api/checkin", handleCheckin);

export default {
  fetch: (req: Request) => router.handle(req)
};
```

---

# 3. CHECKIN ROUTE

```ts
export async function handleCheckin(req: Request) {
  const body = await req.json();

  const clarity = (body.focus + body.work) / 2;
  const stability = (body.sleep + (10 - body.stress)) / 2;
  const value = (body.work + body.contrib) / 2;
  const legacy = (body.contrib + body.rel) / 2;

  return new Response(JSON.stringify({
    clarity, stability, value, legacy
  }));
}
```

---

# 4. DEPLOY

```bash
npm install -g wrangler
wrangler deploy
```

---

# 5. FINAL DIRECTIVE

Workers = production backbone  
Node local = dev only
