<script>
  import TeamCell from '@/components/tournaments/TeamCell.vue';

  const defaultRounds = [256, 128, 64, 32, 16, 8, 4, 2, 1];
  export default {
    name: 'TournamentBracket',
    components: {TeamCell},
    props: {
      bracketSize: {
        type: Number,
        default: 8,
      },
      roundTournament: {
        type: Array,
        default: null,
      },
      matchStyle: {
        type: Object,
        default: () => ({
          width: '100%',
          height: '50px',
          position: 'relative',
        }),
      },
    },
    computed: {
      rounds() {
        return defaultRounds.filter(rounds => rounds <= this.bracketSize);
      },
    },
    methods: {
      roundTitle(round) {
        if (round === 4) return 'Semifinals';
        if (round === 2) return 'Final';
        if (round === 1) return 'Winner';
        else return `1 / ${round / 2}`;
      },
      log(log) {
        console.log(log);
      },
    },
  };
</script>

<template>
  <div id="style-2" class="tournament-brackets">
    <div class="bracket">
      <template v-for="(round, index) in rounds">
        <div
          :key="index"
          class="round"
          style="text-align: center; font-family: 'Unbounded', sans-serif"
          :class="['round-' + round]">
          {{ roundTitle(round) }}
          <template v-for="(match, matchIndex) in round">
            <div :key="matchIndex" class="match">
              <TeamCell
                v-if="rounds.indexOf(round) < roundTournament.length"
                class="match__content"
                :style="matchStyle"
                :team-tag="
                  matchIndex % 2 === 0
                    ? roundTournament[rounds.indexOf(round)].matches[
                        Math.floor(matchIndex / 2)
                      ].teamA
                    : roundTournament[rounds.indexOf(round)].matches[
                        Math.floor(matchIndex / 2)
                      ].teamB
                "
                :class="
                  $vuetify.theme.dark ? 'tw-border-white' : 'tw-border-black'
                ">
              </TeamCell>

              <TeamCell
                v-else
                class="match__content tw-rounded"
                :style="matchStyle"
                :team-tag="
                  roundTournament[roundTournament.length - 1].matches[0].winner
                " />

              <!--              rounds.indexOf(round)-->
              <!--              Math.floor(matchIndex / 2) -->
            </div>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<style>
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  .bracket {
    display: flex;
  }
  .round {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
  .round:first-child .match::before {
    display: none;
  }
  .round:first-child .match__content::before {
    display: none;
  }
  .round:last-child .match::after {
    display: none;
  }
  .match {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 10px;
    padding: 6px 0;
    flex-grow: 1;
    position: relative;
  }
  .match::before {
    content: '';
    display: block;
    min-height: 30px;
    border-left: 2px solid purple;
    position: absolute;
    left: -10px;
    top: 50%;
    margin-top: -15px;
    margin-left: -2px;
  }
  .match:nth-child(odd)::after {
    content: '';
    display: block;
    border: 2px solid transparent;
    border-top-color: purple;
    border-right-color: purple;
    height: 50%;
    position: absolute;
    right: -10px;
    width: 10px;
    top: 50%;
  }
  .match:nth-child(even)::after {
    content: '';
    display: block;
    border: 2px solid transparent;
    border-bottom-color: purple;
    border-right-color: purple;
    height: 50%;
    position: absolute;
    right: -10px;
    width: 10px;
    bottom: 50%;
  }
  .match__content::before {
    content: '';
    display: block;
    width: 10px;
    border-bottom: 2px solid purple;
    margin-left: -2px;
    position: absolute;
    top: 50%;
    left: -10px;
  }
</style>
