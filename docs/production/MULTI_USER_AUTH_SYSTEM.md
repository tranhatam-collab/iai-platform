# MULTI_USER_AUTH_SYSTEM.md
## IAI — Auth System
## Version 1.0

---

# 0. GOAL

Enable:
- login
- session
- multi-user

---

# 1. METHOD

Use:
- email magic link
- JWT session

---

# 2. FLOW

1. user enters email
2. system sends link
3. user clicks -> login
4. token stored

---

# 3. TOKEN STRUCTURE

user_id  
workspace_id  
role  
exp  

---

# 4. STORAGE

- KV for session
- D1 for user

---

# 5. MIDDLEWARE

Every request must:
- verify token
- attach user context

---

# 6. FINAL DIRECTIVE

Auth must be:
- simple
- secure
- invisible
