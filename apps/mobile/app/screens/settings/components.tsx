/*
This file is part of the Notesnook project (https://notesnook.com/)

Copyright (C) 2022 Streetwriters (Private) Limited

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

import React, { ReactElement } from "react";
import { AccentColorPicker, HomagePageSelector } from "./appearance";
import { AutomaticBackupsSelector } from "./backup-restore";
import DebugLogs from "./debug";
import { ConfigureToolbar } from "./editor/configure-toolbar";
import { Subscription } from "./subscription";
export const components: { [name: string]: ReactElement } = {
  colorpicker: <AccentColorPicker wrap={true} />,
  homeselector: <HomagePageSelector />,
  autobackups: <AutomaticBackupsSelector />,
  subscription: <Subscription />,
  configuretoolbar: <ConfigureToolbar />,
  "debug-logs": <DebugLogs />
};