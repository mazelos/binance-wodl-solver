export default function WordsList({
  words,
  toggleShowCopiedNotification,
}: {
  words: string[] | undefined;
  toggleShowCopiedNotification: (show: boolean) => void;
}): JSX.Element {
  if (!words) return <></>;

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl text-gray-800">Words {words?.length || 0}</h2>
      <ul role="list" className="mt-3 grid grid-cols-3 gap-5 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 sm:gap-6">
        {words?.map(word => (
          <li key={word} className="col-span-1 flex rounded-md">
            <button
              type="button"
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => {
                navigator.clipboard.writeText(word);
                toggleShowCopiedNotification(true);
              }}
            >
              {word}
              <div className="ml-2 -mr-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3 h-3 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
