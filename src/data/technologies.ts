import type { IconType } from 'react-icons'
import {
  SiHtml5, SiCss, SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiVite,
  SiTailwindcss, SiBootstrap, SiFramer, SiGreensock, SiThreedotjs, SiNodedotjs,
  SiExpress, SiPython, SiPhp, SiJson, SiSocketdotio, SiGit, SiGithub,
  SiPnpm, SiEslint, SiPrettier, SiDocker, SiLinux, SiGnubash, SiGoogle,
  SiVercel, SiGithubactions, SiNetlify, SiCloudflare
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { TbApi, TbDatabase, TbLock, TbRobot, TbSettingsAutomation, TbServer, TbTerminal2, TbPlugConnected, TbBrandOpenai } from 'react-icons/tb'
import { FaNpm } from 'react-icons/fa'

export type TechItem = { name: string; icon: IconType; color: string }
export type TechCategory = { id: string; title: string; description: string; items: TechItem[] }

export const techCategories: TechCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Membangun antarmuka yang responsif, interaktif, dan nyaman digunakan.',
    items: [
      { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: SiCss, color: '#1572B6' },
      { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'React', icon: SiReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
      { name: 'Vite', icon: SiVite, color: '#646CFF' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'Bootstrap', icon: SiBootstrap, color: '#7952B3' },
      { name: 'Framer Motion', icon: SiFramer, color: '#E8E8E8' },
      { name: 'GSAP', icon: SiGreensock, color: '#88CE02' },
      { name: 'Three.js', icon: SiThreedotjs, color: '#FFFFFF' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Mengelola logika server, data, dan koneksi antar sistem.',
    items: [
      { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
      { name: 'Express.js', icon: SiExpress, color: '#FFFFFF' },
      { name: 'Python', icon: SiPython, color: '#3776AB' },
      { name: 'PHP', icon: SiPhp, color: '#777BB4' },
      { name: 'REST API', icon: TbApi, color: '#7EB6FF' },
      { name: 'JSON', icon: SiJson, color: '#CFCFCF' },
      { name: 'WebSocket', icon: SiSocketdotio, color: '#FFFFFF' },
      { name: 'Authentication', icon: TbLock, color: '#A9B4C2' },
      { name: 'Database Integration', icon: TbDatabase, color: '#7EB6FF' },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    description: 'Perangkat kerja untuk membangun, menguji, dan merapikan workflow.',
    items: [
      { name: 'Git', icon: SiGit, color: '#F05032' },
      { name: 'GitHub', icon: SiGithub, color: '#FFFFFF' },
      { name: 'VS Code', icon: VscVscode, color: '#007ACC' },
      { name: 'npm', icon: FaNpm, color: '#CB3837' },
      { name: 'pnpm', icon: SiPnpm, color: '#F69220' },
      { name: 'ESLint', icon: SiEslint, color: '#4B32C3' },
      { name: 'Prettier', icon: SiPrettier, color: '#F7B93E' },
      { name: 'Docker', icon: SiDocker, color: '#2496ED' },
      { name: 'Linux', icon: SiLinux, color: '#FCC624' },
      { name: 'Termux', icon: TbTerminal2, color: '#A9B4C2' },
      { name: 'Bash', icon: SiGnubash, color: '#4EAA25' },
    ],
  },
  {
    id: 'ai',
    title: 'AI & Automation',
    description: 'Eksplorasi AI, integrasi API, dan otomasi workflow digital.',
    items: [
      { name: 'AI Agent Development', icon: TbRobot, color: '#7EB6FF' },
      { name: 'Google Gemini', icon: SiGoogle, color: '#8AB4F8' },
      { name: 'OpenAI API', icon: TbBrandOpenai, color: '#FFFFFF' },
      { name: 'Prompt Engineering', icon: TbPlugConnected, color: '#A9B4C2' },
      { name: 'MCP Integration', icon: TbPlugConnected, color: '#7EB6FF' },
      { name: 'Workflow Automation', icon: TbSettingsAutomation, color: '#A9B4C2' },
      { name: 'Bot Development', icon: TbRobot, color: '#D7DDE5' },
      { name: 'API Integration', icon: TbApi, color: '#7EB6FF' },
    ],
  },
  {
    id: 'deploy',
    title: 'Deployment & Infrastructure',
    description: 'Merilis, mengelola, dan menjaga aplikasi tetap dapat diakses.',
    items: [
      { name: 'Vercel', icon: SiVercel, color: '#FFFFFF' },
      { name: 'GitHub Actions', icon: SiGithubactions, color: '#2088FF' },
      { name: 'Netlify', icon: SiNetlify, color: '#00C7B7' },
      { name: 'Cloudflare', icon: SiCloudflare, color: '#F38020' },
      { name: 'VPS', icon: TbServer, color: '#A9B4C2' },
      { name: 'Linux Server', icon: SiLinux, color: '#FCC624' },
      { name: 'CI/CD', icon: TbSettingsAutomation, color: '#7EB6FF' },
    ],
  },
]

export const marqueeRows = [
  ['WEB DEVELOPMENT', 'NEXT.JS', 'REACT', 'TYPESCRIPT', 'JAVASCRIPT', 'HTML5', 'CSS3'],
  ['NODE.JS', 'AI AGENT DEVELOPMENT', 'BOT DEVELOPMENT', 'API INTEGRATION', 'AUTOMATION', 'CREATIVE TECHNOLOGY'],
]
