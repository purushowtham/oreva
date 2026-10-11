# Animation tools

This project uses plain CSS for its existing design. React Bits is available through the shadcn registry without changing that styling. Install a TypeScript + CSS component with, for example:

```sh
npx shadcn@latest add @react-bits/BlurText-TS-CSS
```

The project-level shadcn MCP server is configured in `.codex/config.toml`. Restart Codex in this trusted project to load it.

GSAP and its React hook are installed. In a client component, import `gsap`, `ScrollTrigger`, and `useGSAP` from `@/lib/gsap`. Scope animations with `useGSAP` so they clean up when the component unmounts.
