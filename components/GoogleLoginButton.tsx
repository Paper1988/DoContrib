"use client";
import { Avatar, Box, Button, IconButton, Menu, Tooltip } from '@mui/material';
import { signIn, signOut, useSession } from "next-auth/react";
import { MouseEvent, useState } from 'react';

export default function LoginButton() {
    const { data: session } = useSession();
    const [ anchorElUser, setAnchorElUser ] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            {session ? (
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title={session.user?.name}>
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar src={session.user?.image ?? ""} />
                        </IconButton>
                    </Tooltip>

                    <Menu
                        sx={{ mt: '45px' }}
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <Button sx={{ textAlign: 'center' }} onClick={() => signOut()}>登出</Button>
                    </Menu>
                </Box>
            ) : (
                <Button onClick={() => signIn("google")}>使用 Google 登入</Button>
            )}
        </>
    );
}