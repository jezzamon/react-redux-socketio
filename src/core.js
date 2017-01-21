import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
  return state.set('entries', List(entries));
}

//explanation of Immutable's updateIn function :
//What the code expresses is "reach into the nested data structure path ['tally', 'Trainspotting'], and apply this function there. If there are keys missing along the path, create new Maps in their place. If the value at the end is missing, initialize it with 0".

// tally : {
//		'Trainspotting' : 1,
//		'28 days later' : 3
//	}

export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  );
}
function getWinners(vote) {
  if (!vote) return [];
  const [a, b] = vote.get('pair');
  const aVotes = vote.getIn(['tally', a], 0);
  const bVotes = vote.getIn(['tally', b], 0);
  if      (aVotes > bVotes)  return [a];
  else if (aVotes < bVotes)  return [b];
  else                       return [a, b];
}

export function next(state) {
  const entries = state.get('entries')
                       .concat(getWinners(state.get('vote')));
  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first());
  } else {
		//The implementation for this will merge an update into the old state, where the first two entries are put in one List, and the rest in the new version of entries:
    return state.merge({
      vote: Map({pair: entries.take(2)}),
      entries: entries.skip(2)
    });
  }
}


