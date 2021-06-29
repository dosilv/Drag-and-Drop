import React from 'react';
import styled from 'styled-components';
import SourceArea from './Components/SourceArea';
import TargetArea from './Components/TargetArea';

function Main() {
  document.body.style.overflow = 'hidden';

  return (
    <Container>
      <SourceArea />
      <TargetArea />
    </Container>
  );
}

const Container = styled.div`
  ${({ theme }) => theme.flexSet()};
  position: relative;
  padding: 50px;
`;

export default Main;
