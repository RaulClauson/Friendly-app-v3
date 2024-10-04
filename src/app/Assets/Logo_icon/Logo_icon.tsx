interface Propriedades {
    width: string;
    height: string;
}

export default function Logo_icon(props: Propriedades) {
    return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.width}
        height={props.height}
        viewBox="0 0 21 17"
        className="logo_icon"
        role="img"
        aria-labelledby="Logo Friendly"
    >
    <title>Logo Friendly</title>
    <rect x="12.7129" y="0.831055" width="8" height="16" rx="4" fill="black"/>
    <rect x="0.714844" y="0.831055" width="8" height="16" rx="4" fill="black"/>
    </svg>
    );
  }