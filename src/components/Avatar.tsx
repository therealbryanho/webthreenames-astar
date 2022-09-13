import { currency } from "../utils/constants";

export type AvatarProps = {
  url: string | undefined;
  domain: string;
  price: string
};


export default function Avatar({ url, domain, price }: AvatarProps) {
  //   if (url) {
  //     return <img src={url} alt="Avatar record of the domain" className="avatar" />;
  //   } else {
  //     return (
  //       <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs>
  // <path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7v251.6H270.3z"/>
  // 	<g>

  // <path className="st1" fill="#FFF" d="M98.4,55.5c0.2,1.4,0.2,2.7,0.2,4.1c0,19-15.5,34.3-34.4,34.3c-13.3,0-25.5-7.8-31.1-19.9l5.5-2.7    c6.4,14.2,23.2,20.4,37.3,14C86,80.7,92.5,70.7,92.5,59.6c0-0.3,0-0.6,0-0.9L98.4,55.5z M64.3,25.3c14,0,26.7,8.5,31.9,21.6    l-5.9,1.9c-6-14.4-22.5-21.2-36.9-15.2c-10.5,4.4-17.4,14.7-17.3,26.1c0,0.2,0,0.4,0,0.6l-5.7,4.7c-0.3-1.7-0.4-3.5-0.4-5.3    C30,40.7,45.3,25.3,64.3,25.3C64.3,25.3,64.3,25.3,64.3,25.3z"/>
  // <polygon className="st1" fill="#FFF" points="26,73.4 59.6,45.9 58.2,57.3 77.8,46.2 76.8,57.1 102.5,48.9 67.7,68.1 70.3,57.2 50.1,69 51.5,60.6       "/>
  // </g>


  // 	<defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#17b6d7"/><stop offset="1" stop-color="#9714b3" stop-opacity=".5"/><stop offset="1" stop-color="#280bfd" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">{domain}</text></svg>
  //     );
  //   }

  return (
    <div className={`card-body ${url ? 'url-gradient' : 'card-gradient'}`} style={url ? { backgroundImage: `url(${url})` } : {}}>
      {url && <span className='bg-overlay'></span>}
      <div className='card-data'>
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z" /><defs><filter id="A" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2"  width="200%" height="200%" /></filter></defs>
          <path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7V270.3z" />
          <g>

            <path className="st1" fill="#FFF" d="M30.1,25.3c1.9,0.5,2.8,1.8,3.1,3.7c1.4,8.7,2.9,17.3,4.4,26c1.4,8.4,2.9,16.8,4.3,25.2c0.3,1.9,0.7,3.9,1,5.8  c0.4,2.1-0.9,4-2.9,4.3c-1.9,0.3-3.7-1-4.1-3c-1.2-7.2-2.5-14.3-3.7-21.5c-1.2-7.1-2.4-14.2-3.6-21.3c-0.8-5-1.7-10-2.5-14.9  c-0.3-1.9,0.7-3.6,2.6-4.1c0.1,0,0.2-0.1,0.3-0.1L30.1,25.3z" />
            <path className="st1" fill="#FFF" d="M41.8,75.1c-0.4-2.2-0.8-4.4-1.1-6.7c0-0.2,0.2-0.4,0.4-0.6c3.2-2.1,6.9-3.4,10.6-4c13.5-2,26.5,6.1,30.6,19.1  c5.1,15.9-5.2,32.8-21.6,35.7c-15.1,2.7-29.5-7.4-32.2-22.5c-1.3-7.2,0.2-13.9,4.1-20.1c0.1-0.1,0.2-0.2,0.4-0.5  c0.2,1.2,0.4,2.3,0.6,3.3c0.4,2.5,0.8,4.9,1.2,7.4c0,0.4,0,0.8-0.1,1.2c-2.1,11.2,5.5,22.5,16.7,24.7c11.7,2.3,22.8-4.8,25.4-16.5  c2.6-11.7-5.4-23.6-17.2-25.6c-6.4-1.1-12.2,0.5-17.3,4.5l-0.4,0.3C41.9,75.1,41.9,75.1,41.8,75.1z" />
            <path className="st1" fill="#FFF" d="M72.4,87.4c0,2.1-1.7,3.8-3.8,3.8c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c0,0,0,0,0,0  C70.6,83.7,72.3,85.3,72.4,87.4z" />
            <path className="st1" fill="#FFF" d="M58.1,103.8c0,2.1-1.7,3.8-3.8,3.8c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c0,0,0,0,0,0  C56.4,100.1,58.1,101.7,58.1,103.8z" />
            <path className="st1" fill="#FFF" d="M59.4,75c2.1,0,3.8,1.7,3.8,3.8c0,2.1-1.7,3.8-3.8,3.8c-2.1,0-3.8-1.7-3.8-3.8c0,0,0,0,0,0  C55.6,76.7,57.3,75,59.4,75C59.4,75,59.4,75,59.4,75z" />
            <path className="st1" fill="#FFF" d="M66.1,103.2c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8c0,0,0,0,0,0  C69.9,101.5,68.2,103.2,66.1,103.2C66.1,103.2,66.1,103.2,66.1,103.2z" />
            <path className="st1" fill="#FFF" d="M43.8,83.2c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8c0,2.1-1.7,3.8-3.8,3.8C45.5,87,43.8,85.3,43.8,83.2  C43.8,83.2,43.8,83.2,43.8,83.2z" />
            <path className="st1" fill="#FFF" d="M57,87.5c2.1,0,3.7,1.8,3.7,3.9c0,2.1-1.8,3.7-3.9,3.7c-2.1,0-3.7-1.8-3.7-3.9c0,0,0,0,0,0  C53.2,89.1,54.9,87.5,57,87.5z" />
            <path className="st1" fill="#FFF" d="M45.1,98.9c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8c0,0,0,0,0,0  C48.9,97.3,47.2,98.9,45.1,98.9C45.2,98.9,45.2,98.9,45.1,98.9z" />
          </g>
        </svg> */}

        <svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"> <path fill="url(#B)" d="M0 0h270v270H0z" /><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%" /></filter></defs>
          <path className="st0" d="M270.3,270.3H0V18.7C0,8.4,8.4,0,18.7,0h233c10.3,0,18.7,8.4,18.7,18.7v251.6H270.3z" />
          <g>

            <path className="st1" fill="#FFF" d="M98.4,55.5c0.2,1.4,0.2,2.7,0.2,4.1c0,19-15.5,34.3-34.4,34.3c-13.3,0-25.5-7.8-31.1-19.9l5.5-2.7    c6.4,14.2,23.2,20.4,37.3,14C86,80.7,92.5,70.7,92.5,59.6c0-0.3,0-0.6,0-0.9L98.4,55.5z M64.3,25.3c14,0,26.7,8.5,31.9,21.6    l-5.9,1.9c-6-14.4-22.5-21.2-36.9-15.2c-10.5,4.4-17.4,14.7-17.3,26.1c0,0.2,0,0.4,0,0.6l-5.7,4.7c-0.3-1.7-0.4-3.5-0.4-5.3    C30,40.7,45.3,25.3,64.3,25.3C64.3,25.3,64.3,25.3,64.3,25.3z" />
            <polygon className="st1" fill="#FFF" points="26,73.4 59.6,45.9 58.2,57.3 77.8,46.2 76.8,57.1 102.5,48.9 67.7,68.1 70.3,57.2 50.1,69 51.5,60.6       " />
          </g>
        </svg>


        <div className="avatar-content">
          <h2 className={`domain-name ${!price && 'mb-3'}`}>{domain}</h2>
          {price
            &&
            <h3 className="price">{price} {currency}</h3>
          }
        </div>
      </div>
    </div>
  )
}
