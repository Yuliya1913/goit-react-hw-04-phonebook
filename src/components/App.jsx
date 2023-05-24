import { useState, useEffect } from 'react';
import { ContactForm } from 'components/ContactForm/ContactForm';
import { nanoid } from 'nanoid';
import { Filter } from 'components/Filter/Filter';
import { ContactsList } from 'components/ContactsList/ContactsList';
import css from 'components/App.module.css';

export const App = () => {
  //т.к.начальное значение useState contacts зависит от данных пришедших из localStorage, то в начальное значение записываем
  // функцию, которая вернет значения из localStorage или по умолчанию [], если данных не будет, функция выполнится один раз при первом рендере
  // (ленивая инициализация состояния)
  const [contacts, setContacts] = useState(() => {
    return JSON.parse(localStorage.getItem('contacts') ?? []);
  });

  const [filter, setFilter] = useState('');

  // если изменились(обновились) данные(добавила или удалила контакт), то сохраняем итоговый список контактов в localStorage

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const formSubmit = dataForm => {
    const isExist = contacts.find(
      contact => contact.name.toLowerCase() === dataForm.name.toLowerCase()
    );
    // если вводим имя контакта, какое уже есть в телеф.книге, выводим сообщение, что имя такое есть такое и выходим
    if (isExist) {
      alert(`${dataForm.name} is already in contacts.`);
      return;
    }

    // записываем пришедшие данные в новый объект со свойствами
    const newData = {
      ...dataForm,
      id: nanoid(),
    };

    // добавляем этот объект нового контакта в массив контактов
    setContacts(prevState => {
      return [...prevState, newData];
    });
  };

  // удаляем  контакт из списка контактов
  const deleteContact = contactId => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== contactId)
    );
  };

  const handleFilter = event => {
    // в свойсво filter объекта контакта добавляем значение введенное в инпут для фильтра
    setFilter(event.currentTarget.value);
  };

  const getVisibleContacts = () => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  };

  // записываем в отдельный массив контакты, которые отфильтровали для поиска из всех контактов по условию в инпуте
  //  и записываем в качестве пропса для рендера списков контакта по условию, чтобы не менять исходный массив контактов
  const visibleTelephone = getVisibleContacts();

  const isContacts = contacts.length > 0;

  return (
    <div className={css.container}>
      <h1>Phonebook</h1>
      <ContactForm onSubmit={formSubmit} />
      <h2>Contacts</h2>

      {isContacts && <Filter value={filter} onChange={handleFilter} />}

      {isContacts && (
        <ContactsList
          contacts={visibleTelephone}
          onDeleteContact={deleteContact}
        />
      )}
    </div>
  );
};
