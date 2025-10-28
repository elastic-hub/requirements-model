export default {
  wrapper: "",
  inner: "flex justify-between",
  tagSection: "border-2 dark:border-golden duration-500 rounded-xl block w-fit h-fit pl-3 pr-3 hover:cursor-pointer dark:text-golden hover:dark:saturate-[300%]",
  tags: {
    title: "title flex justify-center items-center",
    clear: "flex items-center border border-red-400 text-red-500 hover:text-white px-3 py-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-all duration-200",
    list: "flex items-center px-3 py-1 m-1 border border-gray-300 dark:border-gray-600 rounded-full transition-all duration-300 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
    selected: "bg-primary-300 border-primary-400 text-golden dark:bg-primary-700 dark:border-primary-600 dark:hover:shadow-lg dark:scale-105 transition-all duration-300",
  },
  header: "",
  title: "title -mt-9 text-3xl font-extrabold text-left dark:text-golden",
  underline: "border-b-[3px] border-neutral-500 dark:border-yellow-500 rounded-xl w-32 -mt-2",
  subtitle: "subtitle text-xl font-semibold text-gray-600 dark:text-golden/[0.9] text-left -mt-14",
  text: "text text-left font-light dark:text-golden/[0.8]",
  base: "justify-between flex flex-wrap",
  gap: "gap-0",
  // Default Tailwind CSS values
  default: {
  }
}