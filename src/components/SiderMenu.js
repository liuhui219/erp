import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

const renderMenuItem =
    ({ key, title, icon, link, ...props }) =>
        <Menu.Item
            key={key}
            {...props}

        >
            <Link style={{display:'flex',alignItems:'center'}} to={link || key}>
                {icon && <Icon type={icon} />}

                <span style={{display:'flex',justifyContent:'space-between',alignItems:'center',flex:1}} className="nav-text">{title}<Icon type="right" style={{fontSize:10,margin:0}} /></span>


            </Link>
        </Menu.Item>;

const renderSubMenuSon =
    ({ key, title, icon, link, sub, ...props }) =>
        <Menu.SubMenu
            key={key || link}
            title={
                <span>
                    {icon && <Icon type={icon} />}
                    <span className="nav-text">{title}</span>
                </span>
            }
            {...props}
        >
            {sub && sub.map((item,i) => renderMenuItem(item))}
        </Menu.SubMenu>;

const renderSubMenu =
    ({ key, title, icon, link, sub, ...props }) =>
        <Menu.SubMenu
            key={key || link}
            title={
                <span>
                    {icon && <Icon type={icon} />}
                    <span className="nav-text">{title}</span>
                </span>
            }
            {...props}
        >
            {sub && sub.map((item,i) => item.sub && item.sub.length ? renderSubMenuSon(item) : renderMenuItem(item))}
        </Menu.SubMenu>;

export default ({ menus, ...props }) => <Menu {...props}>
    {menus && menus.map(
        item => item.sub && item.sub.length ?
            renderSubMenu(item) : renderMenuItem(item)
    )}
</Menu>;
