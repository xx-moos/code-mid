

const Badge = ({qty=0}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <path fill="#35711E" d="M3.7 103.2l43.4-11 6.7 26.6-43.4 11 4.5-15.1z" />
    <path
      fill="#203F12"
      d="M9.1 131l4.8-16L2 102.7l45.7-11.6 7.1 28.2L9.1 131zm-3.8-27.3l10.6 10.8-4.2 14 41.2-10.4-6.3-24.9-41.3 10.5z"
    />
    <path
      fill="#203F12"
      d="M16.7 113.8l26.9-7.8.7 2.5-27.4 6zM20.1 104.2L47 96.4l.7 2.5-27.4 6zM24.3 120.6l26.9-7.8.7 2.6-27.5 5.9z"
    />
    <path fill="#35711E" d="M196.3 82.7l-43.4 11-6.7-26.6 43.4-11-4.5 15z" />
    <path
      fill="#203F12"
      d="M152.3 94.7l-7.1-28.2L191 54.9l-4.8 16L198 83.2l-45.7 11.5zm-5.1-26.9l6.3 24.9 41.2-10.4-10.6-10.8 4.2-14-41.1 10.3z"
    />
    <g>
      <path
        fill="#203F12"
        d="M183.4 72.4l-27 7.8-.6-2.6 27.4-5.9zM180 82l-27 7.8-.6-2.6 27.4-5.9zM175.8 65.5l-26.9 7.8-.7-2.5 27.4-6z"
      />
    </g>
    <path
      fill="#52AC32"
      d="M110.3 26.4l19.5 16.4c1.4 1.2 3.1 2.1 4.8 2.8l24 8.7c7.3 2.6 11.6 10.1 10.3 17.8l-4.4 25.1c-.3 1.8-.3 3.7 0 5.5l4.4 25.1c1.3 7.6-3 15.1-10.3 17.8l-24 8.7c-1.7.6-3.4 1.6-4.8 2.8l-19.5 16.4c-5.9 5-14.6 5-20.5 0l-19.5-16.4c-1.4-1.2-3.1-2.1-4.8-2.8l-24-8.7c-7.3-2.6-11.6-10.1-10.3-17.8l4.4-25.1c.3-1.8.3-3.7 0-5.5l-4.4-25.1c-1.3-7.6 3-15.1 10.3-17.8l24-8.7c1.7-.6 3.4-1.6 4.8-2.8l19.5-16.4c5.9-4.9 14.5-4.9 20.5 0z"
    />
    <path
      fill="none"
      stroke="#FFF"
      strokeMiterlimit="10"
      strokeWidth="2.345"
      d="M100 170.2c-2.1 0-4.1-.7-5.7-2.1l-19.5-16.4c-2.1-1.7-4.4-3.1-6.9-4l-24-8.7c-4-1.5-6.4-5.6-5.7-9.8l4.4-25.1c.5-2.7.5-5.4 0-8L38.2 71c-.7-4.2 1.6-8.4 5.7-9.8l24-8.7c2.5-.9 4.9-2.3 6.9-4l19.5-16.4c1.6-1.3 3.6-2.1 5.7-2.1s4.1.7 5.7 2.1l19.5 16.4c2.1 1.7 4.4 3.1 6.9 4l24 8.7c4 1.5 6.4 5.6 5.7 9.8l-4.4 25c-.5 2.7-.5 5.4 0 8l4.4 25.1c.7 4.2-1.6 8.4-5.7 9.8l-24 8.7c-2.5.9-4.9 2.3-6.9 4L105.7 168c-1.6 1.4-3.6 2.2-5.7 2.2z"
    />
    <path
      fill="none"
      stroke="#FFF"
      strokeMiterlimit="10"
      strokeWidth="1.759"
      d="M100 165.9c-1.1 0-2.1-.4-2.9-1.1l-19.5-16.4c-2.5-2.1-5.2-3.7-8.2-4.8l-24-8.7c-2.1-.8-3.3-2.9-2.9-5.1l4.4-25.1c.6-3.2.6-6.4 0-9.5l-4.4-25.1c-.4-2.2.8-4.3 2.9-5.1l24-8.7c3-1.1 5.8-2.7 8.2-4.8l19.5-16.4c.8-.7 1.9-1.1 2.9-1.1 1.1 0 2.1.4 2.9 1.1l19.5 16.4c2.5 2.1 5.2 3.7 8.2 4.8l24 8.7c2.1.8 3.3 2.9 2.9 5.1l-4.4 25.1c-.6 3.2-.6 6.4 0 9.5l4.4 25.1c.4 2.2-.8 4.3-2.9 5.1l-24 8.7c-3 1.1-5.8 2.7-8.2 4.8l-19.5 16.4c-.8.7-1.8 1.1-2.9 1.1z"
    />
    <radialGradient
      id="a"
      cx="100"
      cy="100"
      r="59.755"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#6cba20" />
      <stop offset="1" stopColor="#52ac32" />
    </radialGradient>
    <path
      fill="url(#a)"
      stroke="#FFF"
      strokeMiterlimit="10"
      strokeWidth=".586"
      d="M100 163.7c-.6 0-1.1-.2-1.5-.6L79 146.7c-2.6-2.2-5.6-3.9-8.9-5.1l-24-8.7c-1.1-.4-1.7-1.5-1.5-2.7l4.4-25.1c.6-3.4.6-6.9 0-10.3l-4.4-25.1c-.2-1.1.4-2.3 1.5-2.7l24-8.7c3.2-1.2 6.2-2.9 8.9-5.1l19.5-16.4c.4-.4 1-.6 1.5-.6.6 0 1.1.2 1.5.6L121 53.2c2.6 2.2 5.6 3.9 8.9 5.1l24 8.7c1.1.4 1.7 1.5 1.5 2.7L151 94.9c-.6 3.4-.6 6.9 0 10.3l4.4 25.1c.2 1.1-.4 2.3-1.5 2.7l-24 8.7c-3.2 1.2-6.2 2.9-8.9 5.1l-19.5 16.4c-.4.3-.9.5-1.5.5z"
    />
    <g>
      <path
        fill="#35711E"
        d="M164.4 102.8c-.3-1.8-.3-3.7 0-5.5l3-17.1c.3-1.5-.2-3-1.3-4.1-1.2-1.2-2.9-1.7-4.5-1.3L37.8 106.1c-1.8.5-3.1 1.9-3.5 3.7l-3.2 18.1c-.6 3.5 0 7.1 1.5 10.1 1 1.9 3.2 2.9 5.3 2.4L161 109.2c2.4-.6 3.9-2.9 3.5-5.3l-.1-1.1z"
      />
      <path
        fill="#203F12"
        d="M36.8 141.3c-2.1 0-4-1.1-4.9-3-1.7-3.3-2.3-7-1.6-10.6l3.2-18.1c.4-2.1 2-3.9 4.1-4.4l123.8-31.4c.4-.1.9-.2 1.4-.2 1.5 0 2.9.6 4 1.7 1.2 1.3 1.8 3.1 1.5 4.8l-3 17.1c-.3 1.7-.3 3.5 0 5.2l.2 1.1c.5 2.8-1.3 5.6-4.1 6.3L38.2 141.2c-.4.1-.9.1-1.4.1zm126-65.8c-.3 0-.6 0-.9.1L38 106.9c-1.5.4-2.6 1.6-2.8 3L32 128c-.6 3.3-.1 6.6 1.4 9.5.7 1.3 1.9 2 3.4 2 .3 0 .6 0 .9-.1l123.1-31.2c1.9-.5 3.2-2.4 2.8-4.4l-.2-1.1c-.3-1.9-.3-3.9 0-5.8l3-17.1c.2-1.2-.2-2.4-1-3.3-.6-.6-1.6-1-2.6-1z"
      />
      <g>
        <path
          fill="#203F12"
          d="M35.5 123.6l10.1-2.8.5 1.9-10.5 1.5zM38 116.5l10.1-2.9.5 1.9-10.5 1.5zM41.1 128.7l10.1-2.8.5 1.9-10.5 1.5z"
        />
        <g>
          <path
            fill="#203F12"
            d="M160 92.7l-11.2 3.8-.4-1.9 11.4-2.5zM157.4 99.9l-11.1 3.8-.5-1.9 11.5-2.5zM154.3 87.6l-11.1 3.8-.5-1.9 11.5-2.5z"
          />
        </g>
      </g>
    </g>
    <text
      fill="#FFF"
      fontFamily="'Open Sans'"
      fontWeight="700"
      fontStyle="italic"
      fontSize="13.735"
      transform="matrix(.9992 -.2576 .2496 .9683 85.636 145.028)"
    >
      Minimum!
    </text>
    <text
      fill="#FFF"
      fontFamily="'Open Sans'"
      fontWeight="700"
      fontStyle="italic"
      fontSize="20"
      transform="matrix(.9992 -.2576 .2496 .9683 54.647 95.449)"
    >
      Low
    </text>
    <g
      fontFamily="'Open Sans'"
      fontWeight="700"
      fontStyle="italic"
      fontSize="27.318"
    >
      <text
        fill="#203F12"
        transform="matrix(1.0004 -.2527 .2449 .9695 56.613 129.603)"
      >
        {qty} Piece
      </text>
      <text
        fill="#FFF"
        transform="matrix(1.0004 -.2527 .2449 .9695 54.48 128.632)"
      >
        {qty} Piece
      </text>
    </g>
    <path
      fill="none"
      stroke="#FFF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit="10"
      strokeWidth=".921"
      d="M94.8 79.5l50-12.6M94.2 83.8L146 70.6"
    />
  </svg>
  );
};

export default Badge;