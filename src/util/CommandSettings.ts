import { APIApplicationCommandOption } from 'discord-api-types/v10';
import { PermissionString } from 'discord.js';
export interface CommandSettings {
    name: string
    description: string
    options: APIApplicationCommandOption[]
    perm: PermissionString
    category: CommandCategories
}

type CommandCategories = `MODERATION` | `ADMINISTRATION` | `MUSIC` | `FUN` | `CORE`;