import { Avatar, CircularProgress, ClickAwayListener, Divider, Input, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_USERS } from "../../queries/user";
import useUser from "../../hooks/useUser";

const Search = () => {
    const { _id } = useUser();
    const [keyword, setKeyword] = useState('');
    const [showTooltip, setShowTooltip] = useState(true);
    const [SearchUser, { data = {}, loading }] = useLazyQuery(SEARCH_USERS);

    const handleClearKeyword = () => {
        setKeyword('')
    }

    const handleHideTooltip = () => {
        setShowTooltip(false)
    }

    useEffect(() => {
        if (keyword.trim().length > 3) {
            if (!showTooltip) setShowTooltip(true);
            SearchUser({
                variables: {
                    userId: _id,
                    keyword,
                }
            })
        }
    }, [SearchUser, _id, keyword, showTooltip])

    return (
        <ClickAwayListener onClickAway={handleHideTooltip}>
            <Tooltip
                title={
                    (data.searchUsers && keyword.trim().length > 3) ?
                        <SearchList users={data.searchUsers} handleClearKeyword={handleClearKeyword} /> :
                        null
                }
                arrow
                open={showTooltip}
                onOpen={handleHideTooltip}
            >
                <Input
                    onInput={(e) => setKeyword(e.target.value)}
                    size="small"
                    color="secondary"
                    placeholder="Search by username or name"
                    disableUnderline
                    value={keyword}
                    sx={searchInputStyle}
                    startAdornment={<AdornmentSearchIcon />}
                    endAdornment={loading ? <AdornmentProgress /> : keyword ? <AdornmentCloseIcon setKeyword={setKeyword} /> : null}
                />
            </Tooltip>
        </ClickAwayListener>

    );
};


function SearchList({ users, handleClearKeyword }) {
    if(users.length === 0) {
        return (
            <Typography>
                Found no one. Try a different keyword.
            </Typography>
        )
    }

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'inherit', borderRadius: 'inherit' }}>
            {
                users.map((user, i) => {
                    const { username, displayName, image } = user;
                    return (
                        <React.Fragment key={i}>
                            <ListItem key={i} alignItems="flex-start">
                                <Link
                                    onClick={handleClearKeyword}
                                    to={`/social/profile/${username}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ListItemAvatar>
                                        <Avatar alt={displayName} src={image} />
                                    </ListItemAvatar>
                                </Link>
                                <Link
                                    onClick={handleClearKeyword}
                                    to={`/social/profile/${username}`}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    <ListItemText
                                        primary={displayName}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{ display: 'inline' }}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.secondary"
                                                >
                                                    Click to view the user{"'"}s profile
                                                </Typography>
                                                {/* {" — I'll be in your neighborhood doing errands this…"} */}
                                            </React.Fragment>
                                        }
                                    />
                                </Link>
                            </ListItem>
                            <Divider variant="inset" component="li" />
                        </React.Fragment>
                    )
                })
            }
        </List>
    );
}

const AdornmentSearchIcon = () => {
    return (
        <InputAdornment position="start" disablePointerEvents>
            <SearchIcon color="secondary" sx={searchAdornmentStyle} />
        </InputAdornment>
    )
}

const AdornmentProgress = () => {
    return (
        <InputAdornment position="end" disablePointerEvents>
            <CircularProgress
                disableShrink
                color="inherit"
                size={18}
                sx={searchAdornmentStyle}
            />
        </InputAdornment>
    )
}

const AdornmentCloseIcon = ({ setKeyword }) => {
    return (
        <InputAdornment position="end">
            <CloseIcon
                color="inherit"
                onClick={() => setKeyword('')}
                sx={{ ...searchAdornmentStyle, cursor: 'pointer' }}
            />
        </InputAdornment>
    )
}

const searchInputStyle = {
    minWidth: '30%',
    ml: 'auto',
    border: 1,
    borderRadius: 1,
    borderColor: 'gray',
    fontSize: 16,
    color: 'rgba(255, 255, 255, .6)',
    px: 1.1,
    pt: .5,
}

const searchAdornmentStyle = {
    marginTop: '-3px',
}

export default Search;