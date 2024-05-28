import { Scroll, Timer } from 'phosphor-react';
import { NavLink } from 'react-router-dom';

import { HeaderContainer } from './styles';
import LogoIgnite from '../../assets/Logo.svg';

export function Header() {
  return (
    <HeaderContainer>
      <img src={LogoIgnite} alt="" />
      <nav>
        <NavLink title="Timer" aria-label="Link para página Inicial" to="/">
          <Timer size={24} />
        </NavLink>
        <NavLink title="Histórico" aria-label="Link para página de histórico" to="/history">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  );
}
