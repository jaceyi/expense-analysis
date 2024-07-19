import React, { useEffect, useMemo, useState } from 'react';
import { Card, Divider, Checkbox } from 'antd';
import { Column } from '@ant-design/plots';
import { Properties } from '../..';

const getTotalMoney = (data: Properties) =>
  data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.money,
    0
  );

interface ChartsCardProps {
  title: string;
  data: Properties;
  loading: boolean;
  filterType: string;
}

const ChartsCard = ({ title, data, loading, filterType }: ChartsCardProps) => {
  const { total, tags, tagOptions } = useMemo(() => {
    const tags = [...new Set(data.map(item => item.tags).flat())];
    return {
      total: getTotalMoney(data),
      tags,
      tagOptions: tags.map(tag => ({ label: tag, value: tag }))
    };
  }, [data]);

  const [checkedTags, setCheckedTags] = useState<string[]>([]);
  useEffect(() => {
    setCheckedTags(tags);
  }, [tags]);

  const { filterData, filterTotal } = useMemo(() => {
    const filterData = data.filter(item =>
      checkedTags.find(tag => item.tags.includes(tag))
    );
    return { filterData, filterTotal: getTotalMoney(filterData) };
  }, [data, checkedTags]);

  return (
    <Card
      title={title}
      extra={loading ? null : `总计 ${total}`}
      loading={loading}
    >
      <Checkbox.Group
        options={tagOptions}
        value={checkedTags}
        onChange={setCheckedTags}
      />
      <Divider />
      <div style={{ marginTop: -10 }}>{`总计 ${filterTotal}`}</div>
      <Column
        key={`${filterType}-${checkedTags.join('-')}`}
        theme="academy"
        yField="money"
        xField="date"
        colorField="desc"
        stack
        data={filterData}
        slider={{
          x: {
            values: [filterData.length > 20 ? 0.5 : 0, 1]
          }
        }}
      />
    </Card>
  );
};

export default React.memo(ChartsCard);
