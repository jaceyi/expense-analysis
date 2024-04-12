import React, { useState, useEffect } from 'react';
import { useRequest } from '@/hooks';
import ChartsCard from './libs/ChartsCard';
import styles from './style.module.scss';
import { message, Select, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';

export interface Propertie {
  users: string[];
  tags: string[];
  date: string;
  money: number;
  desc: string;
}
export type Properties = Propertie[];

interface FilterOption {
  filter: object;
  label: string;
}
interface FilterMap {
  thisWeek: FilterOption;
  pastWeek: FilterOption;
  thisMonth: FilterOption;
  pastMonth: FilterOption;
  thisYear: FilterOption;
}
const getDateFilterDefault = (key: string) => ({
  property: 'Date',
  date: {
    [key]: {}
  }
});
const getDateFilterRange = (start: Dayjs, end: Dayjs) => ({
  and: [
    {
      property: 'Date',
      date: {
        on_or_after: start.format('YYYY-MM-DD')
      }
    },
    {
      property: 'Date',
      date: {
        on_or_before: end.format('YYYY-MM-DD')
      }
    }
  ]
});

const filterMap: FilterMap = {
  thisWeek: {
    filter: getDateFilterDefault('this_week'),
    label: '本周'
  },
  pastWeek: {
    filter: getDateFilterDefault('past_week'),
    label: '最近一周'
  },
  thisMonth: {
    filter: getDateFilterRange(dayjs().startOf('month'), dayjs()),
    label: '本月'
  },
  pastMonth: {
    filter: getDateFilterDefault('past_month'),
    label: '最近一月'
  },
  thisYear: {
    filter: getDateFilterRange(dayjs().startOf('year'), dayjs()),
    label: '本年'
  }
};
const filterOptions: { label: string; value: string }[] = Object.entries(
  filterMap
).map(([key, { label }]) => ({
  value: key,
  label
}));

const Analysis = () => {
  const [filterType, setFilterType] = useState<keyof FilterMap>('thisMonth');

  const [propertieData, setPropertieData] = useState<Propertie[]>([]);
  const [request, loading] = useRequest([filterType]);
  useEffect(() => {
    (async () => {
      const result: Propertie[] = [];
      const fetchData = async (cursor?: string) => {
        const [err, { data }] = await request('/databases', {
          page_size: 100,
          start_cursor: cursor,
          filter: filterMap[filterType].filter,
          sorts: [
            {
              property: 'Date',
              direction: 'ascending'
            }
          ]
        });
        if (!err) {
          data.results.map(({ properties }: any) => {
            const users = properties.Users.multi_select.map(
              (item: any) => item.name
            );
            const tags = properties.Tags.multi_select.map(
              (item: any) => item.name
            );

            const date: string = properties.Date.date.start;
            const desc: string = properties.Name.title.find(
              (item: any) => item.type === 'text'
            )?.plain_text;
            const money: number = properties.Money.number;

            result.push({
              users,
              tags,
              date,
              money,
              desc
            });
          });
          if (data.has_more) {
            await fetchData(data.next_cursor);
          }
        } else {
          message.warning(`API错误：${JSON.stringify(err)}`);
        }
      };
      await fetchData();
      setPropertieData(result);
    })();
  }, [filterType]);

  const userTags: string[] = [];
  propertieData.forEach(item => {
    userTags.push(...item.users);
  });

  return (
    <div className={styles.container}>
      <Select<keyof FilterMap>
        size="large"
        value={filterType}
        onChange={setFilterType}
        options={filterOptions}
        style={{ width: '100%' }}
      />
      {propertieData.length ? (
        <>
          <ChartsCard title="总览" data={propertieData} loading={loading} />
          {[...new Set(userTags)].map(user => (
            <ChartsCard
              key={user}
              title={`${user}的支出`}
              data={propertieData.filter(item => item.users[0] === user)}
              loading={loading}
            />
          ))}
        </>
      ) : (
        <Spin spinning>
          <div style={{ height: 200 }} />
        </Spin>
      )}
    </div>
  );
};

export default Analysis;
