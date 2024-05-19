import React from "react";
import classNames from "clsx";

interface Props {
  className: string;
}

const DarkLogo: React.FC<Props> = ({ className }) => {
  return (
    <svg
      height={35}
      viewBox="0 0 71 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames("fill-slate-900 dark:fill-slate-700", className)}
      data-v-41cbb0cb
    >
      <rect width={71} height={46} rx={4} />{" "}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.999 12.9711C33.9961 12.9712 33.9931 12.9712 33.9901 12.9712H26.7639C26.2129 12.9712 25.7662 13.4179 25.7662 13.9689V39.175C25.7662 39.7261 25.3195 40.1728 24.7684 40.1728H20.2195C19.6684 40.1728 19.2217 39.7261 19.2217 39.175V13.9689C19.2217 13.4179 18.775 12.9712 18.224 12.9712H10.9978C10.4467 12.9712 10 12.5245 10 11.9734V7.99785C10 7.4468 10.4467 7.00009 10.9978 7.00009H32.6992C32.7036 7.00003 32.708 7 32.7125 7H44.3078C48.6047 7 51.7943 7.96359 53.8766 9.89076C55.9589 11.7863 57.0001 14.7403 57.0001 18.7526V28.4201C57.0001 32.4324 55.9589 35.4022 53.8766 37.3293C51.7943 39.2249 48.6047 40.1727 44.3078 40.1727H29.9282C29.4538 40.1727 29.045 39.8387 28.9505 39.3738L28.5522 37.4155C28.526 37.2866 28.5256 37.1539 28.5508 37.0249L28.9551 34.9603C29.0468 34.492 29.4572 34.1542 29.9343 34.1542H33.9892C34.5402 34.1542 34.9869 33.7075 34.9869 33.1565V13.9688C34.9869 13.4211 34.5455 12.9764 33.999 12.9711ZM49.0674 32.6852C48.175 33.6961 46.5885 34.2016 44.3078 34.2016H42.5292C41.9781 34.2016 41.5314 33.7549 41.5314 33.2039V13.9688C41.5314 13.4178 41.9781 12.9711 42.5292 12.9711H44.3078C46.5885 12.9711 48.175 13.4608 49.0674 14.4402C49.9929 15.4195 50.4557 16.857 50.4557 18.7526V27.8514C50.4557 30.0313 49.9929 31.6426 49.0674 32.6852Z"
        fill="#FAFAFA"
      />
    </svg>
  );
};

export default DarkLogo;
