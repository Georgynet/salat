<script setup>
import {inject, ref, onMounted} from 'vue'
import {useConfirm} from 'primevue/useconfirm'
import moment from 'moment'
import DatePicker from 'primevue/datepicker'
import useUsersService from '@/services/usersService.js'
import useAppStore from '@/stores/appStore.js'

const {addAbsence, fetchAbsences, removeAbsence} = useUsersService(),
    editMode = ref(false),
    dates = ref(null),
    absenceList = ref([]),
    confirm = useConfirm(),
    appStore = useAppStore(),
    appConfig = inject('config');

const loadAbsences = async () => {
  const startOfYear = moment().startOf('year'),
      endOfYear = moment().endOf('year'),
      response = await fetchAbsences(startOfYear, endOfYear);

  absenceList.value = response.map(absence => ({
    id: absence.id,
    startDate: moment(absence.startDate).format('DD.MM.YYYY'),
    endDate: moment(absence.endDate).format('DD.MM.YYYY')
  }));
}

const handleAddAbsence = async () => {
  if (!dates.value || dates.value.length !== 2) return

  const startDate = moment(dates.value[0]).format(appConfig.DATETIME_FORMAT),
      endDate = moment(dates.value[1]).format(appConfig.DATETIME_FORMAT);

  const success = await addAbsence(startDate, endDate)
  if (success) {
    absenceList.value.push({
      startDate: moment(dates.value[0]).format('DD.MM.YYYY'),
      endDate: moment(dates.value[1]).format('DD.MM.YYYY')
    });

    dates.value = null;
  }
}

const deleteAbsence = async (id) => {
  confirm.require({
    message: 'Bist du dir sicher, dass du diesen Eintrag löschen möchtest?',
    header: 'Eintrag löschen',
    acceptLabel: 'Löschen',
    rejectLabel: 'Abbrechen',
    accept: async () => {
      const response = await removeAbsence(id);

      if (response.status === 200) {
        const index = absenceList.value.findIndex(a => a.id === id);
        if (index !== -1) {
          absenceList.value.splice(index, 1);
        }
        appStore.setAppMessage(200, 'Dieser Eintrag wurde erfolgreich gelöscht.');
      } else {
        appStore.setAppMessage(400, 'Es können keine Einträge aus der Vergangenheit oder dieser Woche gelöscht werden');
      }
    },

    reject: () => appStore.setAppMessage(400, 'Löschung abgebrochen'),
    rejectClass: 'p-button-secondary'
  });
}

onMounted(loadAbsences)
</script>

<template>
  <button @click="editMode = !editMode" class="absence-button total-people-button">
    Abwesenheiten hinzufügen
  </button>

  <div v-if="editMode" class="calender-wrapper">
    <DatePicker
        v-model="dates"
        selectionMode="range"
        showIcon
        iconDisplay="input"
        dateFormat="dd.mm.yy"
        :showButtonBar="true"
        :selectOtherMonths="true"
        :disabledDays="[0, 6]"
        :showWeek="true"
        :manualInput="false"
    />
    <button @click="handleAddAbsence" class="add-button total-people-button">
      Hinzufügen
    </button>
  </div>

  <div>
    <h1 class="absence-list-title text-center">Abwesenheiten Liste</h1>
    <div v-for="(absence, index) in absenceList" :key="index" class="absence-item">
      <p class="absence-date">
        {{ absence.startDate }} - {{ absence.endDate }}
      </p>
      <button @click="deleteAbsence(absence.id)" class="delete-button">Löschen</button>
    </div>
  </div>
</template>

<style>
.absence-button {
  margin-bottom: 10px;
}

.add-button {
  padding: 9px 15px;
  margin-left: 10px;
}

.absence-list-title {
  font-size: 20px;
  font-weight: 700;
  margin: 20px 0;
}

.absence-item {
  display: flex;
  margin-bottom: 10px;
}

.absence-date {
  background-color: #fdfdfd;
  border-radius: 5px;
  padding: 10px 15px;
  min-width: 225px;
  max-width: 230px;
}


.delete-button {
  margin-left: 10px;
  background-color: #e94646;
  padding: 7px 15px;
  border-radius: 5px;
}

.delete-button:hover {
  background-color: #dc3333;
}
</style>