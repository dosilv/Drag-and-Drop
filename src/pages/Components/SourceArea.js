import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useRecoilState } from 'recoil';
import { targetState } from '../../states';

function SourceArea(props) {
  const [target, setTarget] = useRecoilState(targetState);
  const dragableItems = useRef([]);

  //   useEffect(() => {
  //     let posX = 0;
  //     let posY = 0;
  //     let copySource = '';

  //     dragableItems.current.forEach(item => {
  //       item.ondragstart = e => {
  //         e.dataTransfer.setData('word', e.target.innerText);

  //         // posX = e.clientX;
  //         // posY = e.clientY;

  //         e.dataTransfer.dropEffect = 'copy';
  //         e.dataTransfer.effectAllowed = 'copy';

  //         // document.body.appendChild(copySource);
  //       };

  //       item.ondrag = e => {
  //         e.preventDefault();
  //         e.dataTransfer.dropEffect = 'copy';
  //         e.dataTransfer.effectAllowed = 'copy';

  //         // e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
  //         // e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;
  //         // posY = e.clientY;
  //         // posX = e.clientX;
  //       };

  //       item.ondragenter = e => {
  //         e.dataTransfer.dropEffect = 'copy';
  //       };

  //       item.ondragend = e => {
  //         e.preventDefault();

  //         if (e.clientX > 420) {
  //           setTarget(target => {
  //             return target.concat({
  //               text: e.target.innerText,
  //               top: e.clientY,
  //               left: e.clientX,
  //             });
  //           });
  //           console.log(target);
  //         }

  //         // e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
  //         // e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;
  //       };
  //     });
  //   }, []);

  let posX = 0;
  let posY = 0;

  let originalX = 0;
  let originalY = 0;

  const dragStartHandler = e => {
    e.dataTransfer.setData('word', e.target.innerText);
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.effectAllowed = 'copy';

    posX = e.clientX;
    posY = e.clientY;

    originalX = e.target.offsetLeft;
    originalY = e.target.offsetTop;
  };

  const dragHandler = e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    e.dataTransfer.effectAllowed = 'copy';

    // e.target.style.left = `${e.target.offsetLeft + e.clientX - posX}px`;
    // e.target.style.top = `${e.target.offsetTop + e.clientY - posY}px`;
    // posY = e.clientY;
    // posX = e.clientX;
  };

  const dragEndHandler = e => {
    e.preventDefault();
    console.log(e);

    if (e.clientX > 420) {
      setTarget(target => {
        return target.concat({
          text: e.target.innerText,
          top: e.clientY,
          left: e.clientX,
        });
      });
    }

    e.target.style.left = `${originalX}px`;
    e.target.style.top = `${originalY - 5}px`;
  };

  return (
    <Container>
      <Label draggable={false}>GOODS 🎁</Label>
      <WordContainer>
        {DATA.map((data, index) => (
          <Word
            key={index}
            ref={el => (dragableItems.current[index] = el)}
            onDragStart={dragStartHandler}
            onDrag={dragHandler}
            onDragEnd={dragEndHandler}
            top={index * 70}
            draggable
          >
            {data}
          </Word>
        ))}
      </WordContainer>
    </Container>
  );
}

const DATA = [
  'Milk 🥛',
  'Cupcake 🧁',
  'Pizza 🍕',
  'Book 📗',
  'Apple 🍎',
  'Lemon 🍋',
];

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 300px;
  height: 800px;
  margin: 10px 0 10px 80px;
  border-radius: 10px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
`;

const Label = styled.div`
  margin: 20px auto;
  color: darkgray;
  text-align: center;
  font-size: 1.4rem;
  font-weight: bold;
`;

const WordContainer = styled.div`
  ${({ theme }) => theme.flexColumnSet()};
`;

const Word = styled.div`
  position: fixed;
  top: ${props => `${props.top + 100}px`};
  width: 260px;
  margin: 5px 0;
  padding: 20px;
  background-color: white;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  /* cursor: pointer; */
`;

export default SourceArea;
