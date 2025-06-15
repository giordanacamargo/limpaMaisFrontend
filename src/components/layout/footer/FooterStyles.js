import styled from 'styled-components';
import {COLORS} from "../../../values/Colors";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 80vh;
`;

export const Content = styled.div`
  flex: 1;
`;

export const Container = styled.div`
  padding-top: 30px;
  left: 0;
  width: 100%;
  background-color: ${COLORS.PRIMARY};
  color: white;
  text-align: center;
  height: 20px;
`;
