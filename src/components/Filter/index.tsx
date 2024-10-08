'use client'
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useCallback} from "react";

export default function Filter({weapons}) {
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams?.toString())
            params.set(name, value)

            return params.toString()
        },
        [searchParams]
    )
    const handleChangeWeapon = (event) => {
        const selectedValue = event.target.value;
        router.push(pathName + '?' + createQueryString('filter', selectedValue))
    }
    const handleChangeSort = (event) => {
        const selectedValue = event.target.value
        router.push(pathName + '?' + createQueryString('sort', selectedValue))
    }
    const submitHandler = (event) => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const searchValue = formData.get('search')
        if (searchValue === '') {
            return;
        } else {
            router.push(pathName + '?' + createQueryString('search', searchValue))
        }
    }
    const resetHandler = () => {
        router.push(pathName + '?' + createQueryString('search', ''))
    }
    return (
        <div className="flex flex-col gap-5">
            <form className="max-w-sm mx-auto">
                <label htmlFor="weaponType" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Weapon
                    type :</label>
                <select id="weaponType"
                        defaultValue={searchParams?.get('filter')!}
                        onChange={handleChangeWeapon}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="">All</option>
                    {weapons.data.map((value, index) => (
                        <option key={index} value={value.displayName}>
                            {value.displayName}
                        </option>
                    ))}
                </select>
                <label htmlFor="sorting" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Sort
                    by : </label>
                <select id="sorting"
                        defaultValue={searchParams?.get('sort')!}
                        onChange={handleChangeSort}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    <option value="asc">Ascendant</option>
                    <option value="desc">Descendant</option>
                </select>
            </form>

            <form onSubmit={submitHandler} className="mx-auto flex flex-col items-center gap-3">
                <label htmlFor="default-search"
                       className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="search" id="default-search"
                           name="search"
                           defaultValue={searchParams?.get('search')!}
                           autoComplete='off'
                           className="block w-[300px] mobile:w-[200px] p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                           placeholder="Vandal Ion, Reaver..." required/>
                    <button type="submit"
                            className="text-white mobile:hidden block absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                    </button>
                </div>
                <button type="submit"
                        className="text-white hidden mobile:block bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                </button>
                <button type="reset" onClick={resetHandler}
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Reset
                    search
                </button>
            </form>

        </div>
    )
}