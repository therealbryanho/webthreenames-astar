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
<path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7v251.6L270.3,270.3L270.3,270.3z"/>
	<g>
  <linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="34.0468" y1="92.9487" x2="93.2178" y2="33.7777">
		<stop offset="1.209320e-03" stop-color="#E2007D"/>
		<stop offset="0.5" stop-color="#0075D1"/>
		<stop offset="1" stop-color="#00E2FF"/>
	</linearGradient>
  <path fill="url(#SVGID_2_)" className="st1" d="M59.2,21.9c2.9-0.3,6-0.2,8.7,0c3.6,0.5,6.8,1.1,10,2.3c13.7,5.2,22.5,15,26.2,29.2c0.7,2.7,1,5.6,1.5,8.4   c0,1.5,0,2.9,0,4.4c-0.1,0.6-0.3,1.2-0.3,1.8c-1.5,16.9-13.9,31.5-30.4,35.8c-3.2,0.8-5.8,1.5-8.2,1.7c-0.9,0-2.5,0-3.4,0   c-0.5-0.1-2-0.2-2.5-0.3c-18.5-1.1-34.6-15.3-38-33.4c-0.4-2.1-0.6-4.2-1-6.3c0-1.5,0-2.9,0-4.4c0.1-0.6,0.2-1.2,0.3-1.8   C23.6,42.2,35.7,27.6,52.2,23C54.5,22.4,56.6,22,59.2,21.9z M95.7,68.9c0.2-0.9,0.4-1.3,0.4-1.7c1.9-14-5.7-27.6-18.6-33.5   c-6.1-2.8-13-1.1-17.2,4.2c-2.4,3-3.7,6.4-4.3,10.1c-0.1,0.4,0,0.8,0,1.4c5.5,0,10.8,0,16.6,0c-0.8-0.3-1.2-0.6-1.6-0.7   c-3.1-0.7-5.1-2.5-5.7-5.6c-0.6-2.9,0.4-5.3,2.9-7c2.5-1.7,5.7-1.6,8.4,0.2c2.2,1.5,3.5,3.6,3.9,6c0.6,2.9,0.6,6,1,8.9   c0.1,0.9,0.2,2.2,0.8,2.6C87.9,57.6,92.5,62.3,95.7,68.9z M79.9,63.8c-2.8,4.7-5.6,9.2-8.4,13.8c0.5-0.2,1-0.6,1.4-1   c2-2,4.5-2.7,7.2-1.9c2.7,0.8,4.2,2.7,4.8,5.3c1,4.4-2.6,8.6-7.5,8.9c-4.6,0.2-8.6-1.7-12.4-4.1c-1.3-0.8-2.2-0.9-3.6-0.3   c-3.3,1.3-6.7,2.5-10.1,3.3c-2.5,0.6-5.2,0.5-8,0.7c0.4,0.4,0.8,0.7,1.3,1c4.9,3.6,10.5,5.7,16.6,6.2c8.4,0.6,16.2-1.4,22.5-6.9   C92.6,81.2,87.9,68.7,79.9,63.8z M52.2,32.8c-0.8,0.3-1.2,0.4-1.6,0.5C38.1,38.7,30,52.2,31.2,65.8c0.3,3.3,1.4,6.2,3.7,8.6   c4.4,4.6,9.8,5.5,15.7,4.2c1.6-0.3,3.2-1,4.6-1.4c-2.7-5-5.2-9.7-7.8-14.3c-0.1,0.5,0,1,0.1,1.5c0.8,3,0.3,5.6-2.1,7.6   c-2.2,1.9-4.8,2.3-7.5,1.1c-2.8-1.2-4.1-3.6-4.2-6.5c-0.1-3,1.1-5.6,3.3-7.5c2.3-2,4.8-3.8,7.4-5.4c1.3-0.8,1.9-1.5,2-3.1   c0.2-4.4,1.2-8.6,3.1-12.6C50.2,36.4,51.2,34.8,52.2,32.8z M56.6,59c1.1,5,3.6,8.9,6.9,12.5c3.7-3.5,6-7.5,7.3-12.2   C66,57.8,61.4,57.9,56.6,59z"/>
  </g>

		
	<defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#D1DEFE"/><stop offset="1" stop-color="#D7FBFC" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">{domain}</text></svg>

    );
  }
}
