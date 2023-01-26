import styled from '@emotion/styled';
import { colors } from '@atlaskit/theme';
import { grid } from './constants';
import './MilestoneWrapper.css';
// $ExpectError - not sure why

const Title = ({ children }) => {
  return <h4 className='TaskKanbanTitle'>{children}</h4>;
};

export default Title;
