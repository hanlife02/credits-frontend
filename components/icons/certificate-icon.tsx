import type { SVGProps } from "react"

export function CertificateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        <path d="M12 15a3 3 0 1 0 6 0a3 3 0 1 0-6 0"></path>
        <path d="M13 17.5V22l2-1.5l2 1.5v-4.5"></path>
        <path d="M10 19H5a2 2 0 0 1-2-2V7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-1 1.73M6 9h12M6 12h3m-3 3h2"></path>
      </g>
    </svg>
  )
}
