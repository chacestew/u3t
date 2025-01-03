import UnderlineLink from '../../../UnderlineLink';
import { Bar } from '../styles';

const InPlay = () => {
  return (
    <Bar>
      <p>
        Welcome! Start a game or{' '}
        <UnderlineLink to="/learn">learn the rules</UnderlineLink>.
      </p>
    </Bar>
  );
};

export default InPlay;
