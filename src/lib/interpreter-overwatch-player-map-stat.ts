import type { BlizzardData } from './parse-blizzard-data'

const map_mappings = {
  '0x0800000000000827': 'Circuit Royal',
  '0x0800000000000938': 'Paraíso',
  '0x0800000000000AEB': 'New Queen Street',
  '0x0800000000000B34': 'Colosseo',
  '0x0800000000000B4C': 'Midtown',
  '0x0800000000000C85': 'Shambali Monastery',
  '0x0800000000000CF2': 'Antarctic Peninsula',
  '0x0800000000000D3E': 'Suravasa',
  '0x0800000000000D53': 'Esperança',
  '0x0800000000000E13': 'New Junk City',
  '0x0800000000000EC0': 'Samoa',
}

const result_mappings = {
  'Defense Rpl {0}:Enter:Enters;': 'enter',
  'Defense Rpl {0}:Win:Wins;': 'win',
  'Map Rpl {0}:Enter:Enters;': 'enter',
  'Map Rpl {0}:Tie:Ties;': 'tie',
  'Map Rpl {0}:Win:Wins;': 'win',
  'Offense Rpl {0}:Enter:Enters;': 'enter',
  'Offense Rpl {0}:Win:Wins;': 'win',
}

export interface Filter {
  season?: string
}

export const interpreterOverwatchPlayerMapStat = (data: BlizzardData, filter: Filter) => {
  const maps = data['overwatch_pc']['player_map_stat'].reduce((maps: any, map: any) => {
    if (filter.season && map.stat_context_name !== filter.season) {
      return maps
    }

    const name = map_mappings[map.map as keyof typeof map_mappings] || map.map

    maps[name] ??= {}
    maps[name][result_mappings[map.stat as keyof typeof result_mappings]] ??= 0
    maps[name][result_mappings[map.stat as keyof typeof result_mappings]] += map.amount

    return maps
  }, {})

  console.log(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(maps)
          .map(([key, map]: [string, any]) => [
            key.padStart(21, ' '),
            Number((map.win / (map.enter - (map.tie || 0))).toFixed(2)),
          ])
          .sort((a, b) => (a[1] > b[1] ? 1 : -1)),
      ),
      null,
      2,
    ),
  )

  console.log(
    JSON.stringify(
      Object.fromEntries(
        Object.entries(maps)
          .map(([key, map]: [string, any]) => [key.padStart(21, ' '), map.enter])
          .sort((a, b) => (a[1] > b[1] ? 1 : -1)),
      ),
      null,
      2,
    ),
  )
}
