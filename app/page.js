'use client'
import React, { useState, useEffect } from 'react';
import styles from "./page.module.css";
import groupsData from './data/groups.json';

export default function Home() {
  let loadTry = false;
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [error, setError] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    privacy: 'all',
    avatarColor: 'all',
    hasFriends: 'all'
  });

  useEffect(() => {
    if (!loadTry) {
      
      fetchGroups();
      console.log(loadTry)
    }
  }, []);

  function fetchGroups() {
    console.log("sadas");
    loadTry = true;
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setGroups(groupsData);
      } else {
        setError('Failed to fetch groups');
      }
    }, 1000);
  }
  

  const applyFilters = () => {
    let filtered = [...groups];

    if (filterOptions.privacy !== 'all') {
      filtered = filtered.filter(group => group.closed === (filterOptions.privacy === 'closed'));
    }

    if (filterOptions.avatarColor !== 'all') {
      filtered = filtered.filter(group => group.avatar_color === filterOptions.avatarColor);
    }

    if (filterOptions.hasFriends !== 'all') {
      filtered = filtered.filter(group => filterOptions.hasFriends === 'yes' ? group.friends && group.friends.length > 0 : !group.friends || group.friends.length === 0);
    }

    setFilteredGroups(filtered);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterOptions({ ...filterOptions, [name]: value });
  };

  const showFriends = (groupId) => {
    const updatedGroups = filteredGroups.map(group => {
      if (group.id === groupId) {
        return { ...group, showFriends: !group.showFriends };
      }
      return group;
    });
    setFilteredGroups(updatedGroups);
  };

  useEffect(() => {
    applyFilters();
  }, [filterOptions, groups]); // Обновляем отфильтрованные группы при изменении фильтров или групп

  return (
    <>
      <main className={styles.main}>
        {error && <div>Error: {error}</div>}
        <div>
          <label>
            Приватность:
            <select name="privacy" value={filterOptions.privacy} onChange={handleFilterChange}>
              <option value="all">Все</option>
              <option value="open">Открытые</option>
              <option value="closed">Зыкрытые</option>
            </select>
          </label>
          <label>
            Цвет аватарки:
            <select name="avatarColor" value={filterOptions.avatarColor} onChange={handleFilterChange}>
              <option value="all">Все</option>
              <option value="red">Красный</option>
              <option value="green">Зелёный</option>
              <option value="yellow">Жёлтый</option>
              <option value="blue">Синий</option>
            </select>
          </label>
          <label>
            Наличие друзей:
            <select name="hasFriends" value={filterOptions.hasFriends} onChange={handleFilterChange}>
              <option value="all">Все</option>
              <option value="yes">Да</option>
              <option value="no">Нет</option>
            </select>
          </label>
        </div>
        {filteredGroups.map(group => (
          <div key={group.id} className='container'>
            <h2>{group.name}</h2>
            {group.avatar_color && (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: group.avatar_color
                }}
              />
            )}
            <p>{group.closed ? 'Закрытая группа' : 'Открытая группа'}</p>
            <p>Количество участников: {group.members_count}</p>
            {group.friends && group.showFriends && (
              <div>
                <p>Друзей:</p>
                <ul>
                  {group.friends.map((friend, index) => (
                    <li key={index}>{friend.first_name} {friend.last_name}</li>
                  ))}
                </ul>
              </div>
            )}
            {group.friends && (
              <button onClick={() => showFriends(group.id)}>Друзья</button>
            )}
          </div>
        ))}
      </main>
    </>
  );
}
