import React from 'react';
import styled from 'styled-components';
import SourceArea from './Components/SourceArea';
import TargetArea from './Components/TargetArea';

function Main() {
  return (
    <Container>
      <SourceArea />
      <TargetArea />
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flexSet()};
`;

export default Main;
