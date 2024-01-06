import type { BlizzardData } from './parse-blizzard-data'

export const season_mappings = {
  '0x01B0000000000055': 'Season 1',
  '0x01B0000000000065': 'Season 2',
  '0x01B0000000000067': 'Season 3',
  '0x01B000000000006B': 'Season 4',
  '0x01B0000000000077': 'Season 6',
  '0x01B000000000007A': 'Season 7',
} as const

export const map_mappings = {
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
} as const

export const result_mappings = {
  'Defense Rpl {0}:Enter:Enters;': 'enter',
  'Defense Rpl {0}:Win:Wins;': 'win',
  'Map Rpl {0}:Enter:Enters;': 'enter',
  'Map Rpl {0}:Tie:Ties;': 'tie',
  'Map Rpl {0}:Win:Wins;': 'win',
  'Offense Rpl {0}:Enter:Enters;': 'enter',
  'Offense Rpl {0}:Win:Wins;': 'win',
} as const

export const gamemode_mappings = {
  'Circuit Royal': 'Escort',
  'Dorado': 'Escort',
  'Route 66': 'Escort',
  'Junkertown': 'Escort',
  'Rialto': 'Escort',
  'Havana': 'Escort',
  'Watchpoint: Gibraltar': 'Escort',
  'Shambali Monastery': 'Escort',
  'Blizzard World': 'Hybrid',
  'Numbani': 'Hybrid',
  'Hollywood': 'Hybrid',
  'Eichenwalde': 'Hybrid',
  "King's Row": 'Hybrid',
  'Midtown': 'Hybrid',
  'Paraíso': 'Hybrid',
  'Busan': 'Control',
  'Nepal': 'Control',
  'Ilios': 'Control',
  'Oasis': 'Control',
  'Lijiang Tower': 'Control',
  'Antarctic Peninsula': 'Control',
  'Samoa': 'Control',
  'Colosseo': 'Push',
  'Esperança': 'Push',
  'New Queen Street': 'Push',
  'New Junk City': 'Flashpoint',
  'Suravasa': 'Flashpoint',
  'Hanamura': 'Assault',
  'Horizon Lunar Colony': 'Assault',
  'Paris': 'Assault',
  'Temple of Anubis': 'Assault',
  'Volskaya Industries': 'Assault',
} as const

export type InterpretedOverwatchPlayerMapStat = {
  season: (typeof season_mappings)[keyof typeof season_mappings]
  map: keyof typeof gamemode_mappings
  statistics: {
    enter: number
    win: number
    tie: number
  }
}[]

export const interpreterOverwatchPlayerMapStat = (
  data: BlizzardData,
): InterpretedOverwatchPlayerMapStat => {
  const results: Record<string, InterpretedOverwatchPlayerMapStat[number]> = {}

  for (const statistic of data['overwatch_pc']['player_map_stat']) {
    const season = season_mappings[statistic.stat_context_name as keyof typeof season_mappings]
    const map = map_mappings[statistic.map as keyof typeof map_mappings] || statistic.map

    if (!season || !map) continue

    const key = `${season} - ${map}`

    results[key] ??= {
      season,
      map,
      statistics: {
        enter: 0,
        win: 0,
        tie: 0,
      },
    }

    results[key].statistics[result_mappings[statistic.stat as keyof typeof result_mappings]] +=
      statistic.amount
  }

  return Object.values(results).sort((a, b) => {
    return Number(a.season.replace('Season ', '')) - Number(b.season.replace('Season ', ''))
  })
}

export const summarizeOverwatchPlayerMapStat = (
  interpretedOverwatchPlayerMapStat: InterpretedOverwatchPlayerMapStat,
): InterpretedOverwatchPlayerMapStat => {
  const results: Record<string, InterpretedOverwatchPlayerMapStat[number]> = {}

  for (const statistic of interpretedOverwatchPlayerMapStat) {
    results[statistic.map] ??= {
      season: 'All' as any,
      map: statistic.map,
      statistics: {
        enter: 0,
        win: 0,
        tie: 0,
      },
    }

    results[statistic.map].statistics.enter += statistic.statistics.enter
    results[statistic.map].statistics.win += statistic.statistics.win
    results[statistic.map].statistics.tie += statistic.statistics.tie
  }

  return Object.values(results)
}
