// @ts-nocheck
import { useState } from "react";
import { Link } from "react-router-dom";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import ListItemButton from "@mui/joy/ListItemButton";
import Sheet from "@mui/joy/Sheet";
import Tooltip from "@mui/joy/Tooltip";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DevicesIcon from "@mui/icons-material/Devices";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

import ColorSchemeToggle from "./ColorSchemeToggle";

export default function Sidebar() {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transition: "width 0.4s, transform 0.4s",
        height: "100dvh",
        width: expanded ? "220px" : "80px",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
        overflow: "visible",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": expanded ? "220px" : "80px",
          },
        })}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: expanded ? "space-between" : "center",
          mb: 2,
        }}
      >
        {expanded && <div></div>}

        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={handleToggle}
          sx={{
            ml: expanded ? 2 : 0,
          }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      <List
        size="sm"
        sx={{
          gap: 1,
          flexGrow: 1,
          alignItems: expanded ? "flex-start" : "center",
          p: expanded && 0,
        }}
      >
        {[
          { icon: <HomeRoundedIcon />, label: "Home", link: "/ui" },
          { icon: <DevicesIcon />, label: "Projects", link: "/ui/projects" },
          { icon: <SettingsRoundedIcon />, label: "Settings", link: "/ui/settings" },
          { icon: <NotificationsIcon />, label: "Notifications", link: "/ui/notifications" },
        ].map((item, index) => {
          if (expanded) {
            return (<ListItem style={{width: '100%'}}>
              <ListItemButton component={Link} to={item.link}>
                {item.icon}
                <ListItemContent>
                  <Typography level="title-sm">{item.label}</Typography>
                </ListItemContent>
              </ListItemButton>
            </ListItem>)
          } else {
            return (
              <ListItem>
                <Tooltip title={item.label} variant="plain" color="neutral" placement="right">
                  <ListItemButton
                    component={Link}
                    to={item.link}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--joy-palette-background-hover)",
                        borderRadius: "50%",
                      },
                    }}
                  >
                    {item.icon}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            )
          }
        })}
      </List>

      <Divider />
      <Box
        sx={{
          mt: "auto",
          display: "flex",
          flexDirection: expanded ? "row" : "column",
          alignItems: "center",
          justifyContent: "center",
          gap: expanded ? 2 : 1,
        }}
      >
        <Tooltip title={!expanded ? "Toggle Theme" : ""} placement="right">
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            sx={{
              "&:hover": {
                backgroundColor: "var(--joy-palette-background-hover)",
              },
            }}
          >
            <ColorSchemeToggle />
          </IconButton>
        </Tooltip>

        <Tooltip title={!expanded ? "Logout" : ""} placement="right">
          <IconButton
            size="sm"
            variant="plain"
            color="neutral"
            sx={{
              "&:hover": {
                backgroundColor: "var(--joy-palette-background-hover)",
              },
            }}
          >
            <LogoutRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Sheet>
  );
}
