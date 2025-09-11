import React from 'react';
import HeaderSidebar from './HeaderSidebar';
import HeaderCl from './HeaderCl';
import HeaderAdm from './HeaderAdm';
import '../../Views/CSS/HeaderSB.css';

const DynamicHeader = ({ user, onLogin, onLogout }) => {
  // Si no hay usuario, mostrar header de invitado
  if (!user) {
    return <HeaderSidebar onLogin={onLogin} />;
  }

  // Si es admin, mostrar header de admin
  if (user.role === 'admin') {
    return <HeaderAdm user={user} onLogout={onLogout} />;
  }

  // Si es usuario normal, mostrar header de usuario
  return <HeaderCl user={user} onLogout={onLogout} />;
};

export default DynamicHeader;