export default function Logo() {
  return (
    <div className="flex items-center">
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 5L23 23M5 23L23 5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="ml-2 text-xl font-bold">PHARMAINTEX</span>
    </div>
  );
}
