import { Dial } from '../sections/Dial';
import { Seal } from '../sections/Seal';
import { Clock } from '../sections/Clock';
import { Strata } from '../sections/Strata';
import { Pressure } from '../sections/Pressure';
import { Break } from '../sections/Break';
import { Table } from '../sections/Table';

/**
 * The forty-five minutes, from the lid going on to it coming off.
 * Pinned sections must mount top to bottom, so this order is the page order.
 * Dial mounts last and refreshes last: it spans the whole run, and it can only
 * measure that correctly once every pin has claimed its spacer.
 */
export function Home() {
  return (
    <>
      <Seal />
      <Clock />
      <Strata />
      <Pressure />
      <Break />
      <Table />
      {/* last, so the pins exist before it measures how long the page is */}
      <Dial />
    </>
  );
}
