import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "@/components/ui/navigation-menu"

export default function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-10">
        <NavigationMenuLink className="text-white" href="/">
          Home
        </NavigationMenuLink>

        {/*lista do dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">
            Desenhos
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/artes_a_mao">
              Artes a Mão
            </NavigationMenuLink>
            <NavigationMenuLink href="/artes_digitais">
              Artes Digitais
            </NavigationMenuLink>
            <NavigationMenuLink href="/comissoes">Comissões</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-white">
            Biscuit
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink href="/pop">Pop</NavigationMenuLink>
            <NavigationMenuLink href="/chibi">Chibi</NavigationMenuLink>
            <NavigationMenuLink href="/anime">Anime</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* normal */}
        <NavigationMenuLink className="text-white" href="/sobre">
          Sobre
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
