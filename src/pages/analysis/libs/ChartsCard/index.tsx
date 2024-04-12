import styles from './style.module.scss';
import React, { useState } from 'react';
import { Card, Divider, Alert, Checkbox } from 'antd';
import Charts from 'echarts-for-react';
import { Properties } from '../..';
import { useDidUpdate } from '@/hooks';
import dayjs from 'dayjs';

interface ChartsCardProps {
  title: string;
  data: Properties;
  loading: boolean;
}
interface Serie {
  type: string;
  stack: string;
  barWidth: string;
  name: string;
  data: number[];
  label?: Object;
}

const ChartsCard = ({ title, data, loading }: ChartsCardProps) => {
  console.log(title, data);

  return <Card title={title} loading={loading}></Card>;
};

export default React.memo(ChartsCard);
