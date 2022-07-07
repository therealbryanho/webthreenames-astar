export type AvatarProps = {
  url: string | undefined;
  domain: string;
};

export default function Avatar({ url, domain }: AvatarProps) {
  if (url) {
    return <img src={url} alt="Avatar record of the domain" className="avatar" />;
  } else {
    return (
      <svg className="avatarSVG" xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs>
<path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7v251.6H270.3z"/>
	<g>
		
  <path fill="#fff" className="st1" d="M53.6,28.7c2-1.1,5.1-1.1,7.1,0l20.5,10.8c1.2,0.6,1.9,1.6,2,2.6h0v54c0,1.1-0.7,2.1-2,2.8l-20.5,10.8  c-2,1.1-5.1,1.1-7.1,0L33.1,98.9c-1.3-0.7-1.9-1.8-2-2.8c0-0.1,0-0.2,0-0.3l0-53.4c0-0.1,0-0.1,0-0.2l0-0.2l0,0c0.1-1,0.7-1.9,2-2.6  L53.6,28.7z M79.9,72.2L60.6,82.3c-2,1.1-5.1,1.1-7.1,0L34.4,72.2V96l19.2,10c1.1,0.6,2.2,1.1,3.3,1.2l0.2,0c1.1,0,2.3-0.6,3.4-1.1  l19.4-10.2V72.2z M27.8,94.9c0,2.1,0.2,3.4,0.7,4.4c0.4,0.8,1,1.4,2.1,2.1l0.1,0c0.2,0.2,0.5,0.3,0.8,0.5l0.4,0.2l1.2,0.7l-1.7,2.7  l-1.3-0.8l-0.2-0.1c-0.4-0.2-0.7-0.4-1-0.6c-3.1-2.1-4.3-4.4-4.3-9.1l0-0.1H27.8z M55.5,57.7c-0.1,0.1-0.3,0.1-0.4,0.2L34.6,68.6  c0,0,0,0-0.1,0l0,0l0,0l0,0l20.5,10.8c0.1,0.1,0.3,0.1,0.4,0.2V57.7z M58.7,57.7v21.9c0.1-0.1,0.3-0.1,0.4-0.2l20.5-10.8  c0,0,0,0,0.1,0l0,0l0,0l0,0L59.1,57.9C59,57.8,58.9,57.8,58.7,57.7z M79.9,45.9l-18.4,9.6l18.4,9.6V45.9z M34.4,45.9v19.2l18.3-9.6  L34.4,45.9z M59.1,31.6c-1.1-0.6-3-0.6-4.1,0L34.6,42.3c0,0,0,0-0.1,0l0,0l0,0l0,0l20.5,10.8c1.1,0.6,3,0.6,4.1,0l20.5-10.8  c0,0,0,0,0.1,0l0,0l0,0l0,0L59.1,31.6z M82.9,32.7l1.3,0.8l0.2,0.1c0.4,0.2,0.7,0.4,1,0.6c3.1,2.1,4.3,4.4,4.3,9.1l0,0.1h-3.2  c0-2.1-0.2-3.4-0.7-4.4c-0.4-0.8-1-1.4-2.1-2.1l-0.1,0c-0.2-0.2-0.5-0.3-0.8-0.5l-0.4-0.2l-1.2-0.7L82.9,32.7z"/>
  </g>

		
	<defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#030FFF"/><stop offset="1" stop-color="#1969FF" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">{domain}</text></svg>

    );
  }
}
