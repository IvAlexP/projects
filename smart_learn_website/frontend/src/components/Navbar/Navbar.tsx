import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/auth/AuthContext';
import styles from './Navbar.module.css';

export const Navbar = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const navItems = user.role === "ADMIN"
    ? [
        { path: '/admin/users', label: 'Users' },
        { path: '/admin/badges', label: 'Badges' },
      ]
    : [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/library', label: 'Library' },
        { path: '/stats', label: 'Stats' },
      ];

  return (
    <nav className={styles.navBar}>
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.path}>
            <NavLink 
              to={item.path} 
              className={({ isActive }) => isActive ? styles.active : ''}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};