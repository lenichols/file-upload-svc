/* eslint-disable */

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
       <button class="btn btn-info" @click.prevent="$refs.fileInput.click()">UPLOAD&nbsp;FILE </button>
        <input
        type="file"
        style="display: none"
        ref="fileInput"
        accept="csv/*"
        @change="onProcessFile" />
        <br/>
        <br/>
        <div class="card" style="min-width: 50rem; max-width: 80%; margin: auto auto">
          <DataTable :value="tbldata" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" editMode="cell" class="p-row-editor-init" @cell-edit-complete="onCellEditComplete" tableClass="editable-cells-table" tableStyle="" :class="{ notloaded: !isLoaded, loaded: isLoaded }">
              <Toolbar class="mb-4">
                  <template #start>
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText  placeholder="Keyword Search" />
                    </span>
                    &nbsp;&nbsp;
                    <div class="flex justify-content-between">
                      <Button type="button" icon="pi pi-filter-slash" label="Clear" outlined @click="clearFilter()" />
                  </div>
                  </template>
                  <template #end>
                      <Button label="Save" icon="pi pi-save" severity="help" />
                  </template>
              </Toolbar>
              <Column v-for="col of columns" :key="col.field" :field="col.field" :header="col.header">
                <template #body="{ data, field }">
                   {{  data[field] }}
                </template>
                <template #editor="{ data, field }">
                  <InputText v-model="data[field]" />
                </template>
              </Column>
          </DataTable>
        </div>
      </div>
    <br/>
    <br/>
    <table id="uploadtbl"></table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

import FormatFileService from '@/services/FormatFileService.js';

export default {
  // eslint-disable-next-line
  name: 'Parse File & Save',
  props: {
    msg: String,
  },
  components: { DataTable, Column },
  data() {
    return {
      isLoaded: false,
      files: null,
      tbldata: [],
      columns: []
    }
  },
  methods: {
    // trigger file input from click  
    onProcessFile(event) {
      var files = event.target.files || event.dataTransfer.files;

      if (!files.length)
        return;

      const filedata = event.target.files[0];
      const filename = event.target.files[0].name;
      const allowedTypes = ["text/csv", "text/xls"];
      const MAX_SIZE = 20000000;
      const tooLarge = filedata.size > MAX_SIZE;

      if(allowedTypes.includes(filedata.type) && !tooLarge){ 
        this.file = filename;
        this.error = false;
        this.message = "";
      } else {
        this.error = true
        this.message =  tooLarge ? `Too large. Max size is ${MAX_SIZE/1000}kb`: " Only CVS or Excel files allowed";
      }

      let promise = new Promise((resolve, reject) => {
        var reader = new FileReader();
        var vm = this;
        reader.onload = e => {
          resolve((vm.fileinput = reader.result));
        };
        reader.readAsText(files[0]);
      });

      promise.then(
          () => {
            this.callJsonParse(this.fileinput)
          },
          error => {
            console.log("error: ", error);
          }
        )

      },
      callJsonParse(readerobj) {
        FormatFileService.parseToJson(readerobj)
        .then(
          (event => {
            this.setToTable(event)
          }).bind(this)
        )
      },
      initFilters() {
          // tabledata.value = {
          //     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          //     name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }
          // }
      },
      setToTable(rawdata) {
        const tableDataReturned = JSON.parse(rawdata.res);
        const columnDataReturned = rawdata.keys;
        let newColumnData = []
        columnDataReturned.forEach(key => {
          newColumnData.push({ field: key, header: key } ) 
        })

        this.isLoaded = true;
        this.columns = newColumnData
        this.tbldata = tableDataReturned
      },
      onCellEditComplete(event) {
        console.log("editing finished")
        Object.keys(this.tbldata).find((key) => key === event.field);
        // Clean New Value
        let { data, newValue, field } = event;
                if (newValue.trim().length > 0) data[field] = newValue;
                  else event.preventDefault();
      },
      clearFilter() {
        console.log("clear")
      }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

@import 'https://cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css';

::v-deep(.editable-cells-table td.p-cell-editing) {
    padding-top: 0;
    padding-bottom: 0;
}

button.btn.btn-info {
  padding: 20px;
  color: white;
  background: #159ba6;
  border-radius: 5px;
  border: none;
}

button.btn.btn-info:hover,
button.btn.btn-info:focus {
  background: #0a6e77;
  cursor: pointer;
}

.loaded {
  display: block;
}
.notloaded {
  display: none;
}
</style>
