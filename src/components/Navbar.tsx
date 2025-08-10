import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {NavLink} from "react-router-dom"

export default function Navbar() {
    return (
        <div className="bg-gray-900 text-white px-4 py-4 border-b border-gray-800 sticky top-0 z-50">
            <NavigationMenu className="w-full">
                <NavigationMenuList className="w-full flex justify-between items-center">

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <NavLink
                                to="/"
                                className="text-lg font-bold transition-transform duration-200 hover:scale-105 hover:text-gray-300"
                            >
                                Settle Debts
                            </NavLink>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <div className="flex gap-6 pl-10">
                    </div>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    )
}
