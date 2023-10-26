<template>
  <!--Start: Title-->
  <div class="intro-y flex items-center py-4">
    <h1 class="text-lg font-medium truncate mr-5">{{ $t("menu.movimenti_matchare") }}</h1>
  </div>
  <!--End: Title-->
  <div class="intro-y flex items-center mt-8">
    <!--Start : Top Buttons-->
    <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
      <button class="btn filter-btn bg-white intro-y flex items-center" v-on:click="filterdiv = !filterdiv">
        <SlidersIcon class="w-4 h-4 mr-2" />{{ filterName }}
      </button>

      <h1 class="py-3 px-4 mt-3 xl:mt-0 align-top ml-auto text-base">
        {{ $t("movimento_da_associare.saldo") }}: <strong>$ {{ saldo }}</strong>
      </h1>
      <button
        :class="((validaMatch == 1) && (validaPartite == 1)) ? 'btn py-3 text-white px-4 w-full xl:w-44 xm:mt-0 align-top bg-primary' : 'btn py-3 px-4 w-full xl:w-44 xm:mt-0 align-top text-black bg-slate-300'"
        :disabled="((validaMatch == 0) || (validaPartite == 0))" @click="setMatchValidaModal()">
        <CheckCircleIcon class="w-4 h-4 mr-2" /> {{ $t("movimento_da_associare.valida_match") }}
      </button>
    </div>
    <!--End : Top Buttons-->

  </div>
  <!--Start : Data List-->
  <div class="intro-y grid grid-cols-12 gap-9 mt-5">
    <!--Start : Filter-->


    <div class="col-span-12 xl:col-span-2 left-part bg-white rounded-lg h-full" v-if="!filterdiv">
      <div class="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
        <div class="flex items-center py-4">
          <h2 class="text-lg font-medium truncate mr-5">{{ $t("commons.Filtri") }}</h2>
          <button class="text-primary w-45 ml-auto" @click="reset()">
            {{ $t("commons.reset") }}
          </button>
        </div>
        <div>
          <h2 class="text-md font-medium truncate mr-5 mb-5">{{ $t("movimento_da_associare.movimenti_heading") }}</h2>
          <!--Start : DropDown fil-->

          <!-- BEGIN: Dropdown with close button -->
          <PreviewComponent v-slot="{ toggle }">

            <div class="mb-3">
              <Preview>
                <!-- <div class="text-center"> -->
                <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                  <DropdownToggle class="btn bg-white w-full flex justify-between">
                    {{ documentoDaCercare['descrizione'] }} {{ documentoDaCercare['iddb'] }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownContent>
                      <DropdownItem v-for="tipi in tipidocumento" :key="tipi.iddb"
                        @click="onChangeTipiDocumento(tipi.iddb, tipi.descrizione)">{{ tipi.descrizione }} - {{ tipi.iddb
                        }}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
                <!-- </div> -->
              </Preview>
            </div>
          </PreviewComponent>
          <!-- END: Dropdown with close button -->

          <!-- BEGIN: Dropdown with close button -->
          <PreviewComponent v-slot="{ toggle }">

            <div class="mb-3">
              <Preview>
                <!-- <div class="text-center"> -->
                <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                  <DropdownToggle class="btn bg-white w-full flex justify-between">
                    {{ anno }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownContent>
                      <DropdownItem v-for="anno in annoOption" :key="anno" @click="onChangeAnno(anno)">{{ anno }}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
                <!-- </div> -->
              </Preview>
            </div>
          </PreviewComponent>
          <!-- END: Dropdown with close button -->
          <!-- BEGIN: Dropdown with close button -->
          <PreviewComponent v-slot="{ toggle }">

            <div class="mb-3">
              <Preview>
                <!-- <div class="text-center"> -->
                <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                  <DropdownToggle class="btn bg-white w-full flex justify-between">
                    {{ mese.desc }}
                    <ChevronDownIcon class="w-4 h-4 ml-2" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownContent>
                      <DropdownItem v-for="mese in meseOption" :key="mese.id" @click="onChangeMese(mese.id, mese.desc)">
                        {{ mese.desc }}
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
                <!-- </div> -->
              </Preview>
            </div>
          </PreviewComponent>
          <!-- END: Dropdown with close button -->

          <!--End : DropDown fil-->
          <!--Button : to show rest of movimenti filters-->

          <PlusCircleIcon v-if="showMoviPlus" class="w-7 h-7 text-blue-700 mx-auto"
            @click="showMovimentiFilters = true; showMoviPlus = false" />

          <!--Buuton : end-->
          <!--start: Rest of movimenti filters-->
          <div v-if="showMovimentiFilters">
            <!--Start : Text filter-->
            <div class="border border-slate-200/60 rounded mb-3">
              <div class="w-full relative">
                <input type="text" class="form-control w-full box pr-10 text-slate-700"
                  :placeholder="$t('match_validata_page.Ragione_Sociale')" v-model="ragione" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 right-3" />
              </div>
            </div>
            <!--End : Text filter-->
            <!--Start: date-->
            <div class="border border-slate-200/60 rounded mb-3 date-range">
              <div class=" relative input-text-color w-full">
                <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="filterDataOpera"
                  :key="filterDataOpera" :placeholder="$t('documenti.Data_Upload')"
                  input-classes="form-control w-56 box pr-10" use-range :formatter="datepickerFormatter"
                  :start-from="datepickerStartFrom" :disable-date="dDate" />
              </div>
            </div>
            <!--End: date-->
            <!-- BEGIN: Dropdown with close button -->
            <PreviewComponent v-slot="{ toggle }">

              <div class="mb-3">
                <Preview>
                  <!-- <div class="text-center"> -->
                  <Dropdown class="flex justify-between" placement="bottom-start" v-slot="{ dismiss }">
                    <DropdownToggle class="btn bg-white w-full flex justify-between">
                      <span>
                        {{ valuta }}
                      </span>
                      <ChevronDownIcon class="w-4 h-4 ml-2" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownContent>
                        <DropdownItem @click="valuta = $t('match_validata_page.Tutte')">
                          {{ $t("match_validata_page.Tutte") }}
                        </DropdownItem>
                        <DropdownItem @click="valuta = $t('match_validata_page.Euro')">
                          {{ $t("match_validata_page.Euro") }}
                        </DropdownItem>
                        <DropdownItem @click="valuta = $t('match_validata_page.Sterlina_Inglese')">
                          {{ $t("match_validata_page.Sterlina_Inglese") }}
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                  <!-- </div> -->
                </Preview>
              </div>
            </PreviewComponent>
            <!-- END: Dropdown with close button -->
            <!--Start : Text filter-->
            <div class="border border-slate-200/60 rounded mb-3">
              <div class="w-full relative">
                <input type="text" class="form-control w-full box pr-10 text-slate-700"
                  :placeholder="$t('movimento_da_associare.conto_bancario')" v-model="conto" />
                <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 right-3" />
              </div>
            </div>
            <!--End : Text filter-->
            <MinusCircleIcon class="w-7 h-7 text-blue-700 mx-auto"
              @click="showMovimentiFilters = false; showMoviPlus = true" />
          </div>
          <!--end :  movimenti filters-->

        </div>
        <div>
          <h2 class="text-md font-medium truncate mr-5">{{ $t('movimento_da_associare.partite_heading') }}</h2>
          <!--Start : Text filter-->
          <div class="border border-slate-200/60 rounded mb-3 mt-7">
            <div class="w-full relative">
              <input type="text" class="form-control w-full box pr-10 text-slate-700"
                :placeholder="$t('Ragioni_Sociali.Ragioni_Sociali')" v-model="ragioneP" />
              <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 right-3" />
            </div>
          </div>
          <!--End : Text filter-->
          <!--Start : Text filter-->
          <div class="border border-slate-200/60 rounded mb-3">
            <div class="w-full relative">
              <input type="text" class="form-control w-full box pr-10 text-slate-700"
                :placeholder="$t('movimento_da_associare.sap_id')" v-model="sapid" />
              <SearchIcon class="w-4 h-4 absolute my-auto inset-y-0 right-3" />
            </div>
          </div>
          <!--End : Text filter-->
          <!--Start: date-->
          <div class="border border-slate-200/60 rounded mb-3 date-range">
            <div class="relative input-text-color w-full">
              <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="filterDataCreazione"
                :key="filterDataCreazione" :placeholder="$t('movimento_da_associare.data_creazione')"
                input-classes="form-control w-56 box pr-10 text-slate-700" use-range :formatter="datepickerFormatter"
                :start-from="datepickerStartFrom" :disable-date="dDate" />
            </div>
          </div>
          <!--End: date-->
          <!--Start: date-->
          <div class="border border-slate-200/60 rounded mb-3 date-range">
            <div class="relative input-text-color w-full">
              <vue-tailwind-datepicker :clearable="true" :options="datepickerOptions" v-model="filterDataScandenza"
                :key="filterDataScandenza" :placeholder="$t('movimento_da_associare.data_scandenza')"
                input-classes="form-control w-56 box pr-10 text-slate-700" use-range :formatter="datepickerFormatter"
                :start-from="datepickerStartFrom" :disable-date="dDate" />
            </div>
          </div>
          <!--End: date-->

          <PlusCircleIcon v-if="showPartitePlus" class="w-7 h-7 text-blue-700 mx-auto"
            @click="showPartiteFilters = true; showPartitePlus = false" />
          <div v-if="showPartiteFilters">
            <!-- BEGIN: Dropdown with close button -->
            <PreviewComponent v-slot="{ toggle }">

              <div class="">
                <Preview>
                  <!-- <div class="text-center"> -->
                  <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                    <DropdownToggle class="btn bg-white w-full flex justify-between">
                      {{ valutaP }}
                      <ChevronDownIcon class="w-4 h-4 ml-2" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownContent>
                        <DropdownItem @click="valutaP = $t('match_validata_page.Tutte')">
                          {{ $t("match_validata_page.Tutte") }}
                        </DropdownItem>
                        <DropdownItem @click="valutaP = $t('match_validata_page.Euro')">
                          {{ $t("match_validata_page.Euro") }}
                        </DropdownItem>
                        <DropdownItem @click="valutaP = $t('match_validata_page.Sterlina_Inglese')">
                          {{ $t("match_validata_page.Sterlina_Inglese") }}
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                  <!-- </div> -->
                </Preview>
              </div>
            </PreviewComponent>
            <!-- END: Dropdown with close button -->
            <MinusCircleIcon class="w-7 h-7 text-blue-700 mx-auto"
              @click="showPartiteFilters = false ; showPartitePlus = true" />
          </div>

        </div>
        <button class="btn btn-sm btn-primary w-18 mt-3 float-right mb-2" @click="applyFilters()">
          {{ $t("commons.applica") }}
        </button>
      </div>
    </div>
    <!--End : Filter-->
    <!--Start : Content-->
    <div :class="(filterdiv == true) ? 'col-span-12 xl:col-span-5 h-full' : 'col-span-12 lg:col-span-4 h-full'">
      <div class="intro-y box h-full">
        <div class="border-b p-4">
          <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
            <h2 class="intro-y flex items-center">
              <b>{{ $t('movimento_da_associare.movimenti_heading') }}</b>
            </h2>
            <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
              <label class="form-check-label ml-0" for="show-example-1">{{ $t('movimento_da_associare.toggle_heading')
              }}</label>
              <input @click="toggle" class="form-check-input mr-0 ml-3" type="checkbox" v-model="toggleMovimento"
                :disabled="validaMatch == 0" />
            </div>
          </div>
          <div class="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
            <!-- <small class="text-slate-500 font-medium leading-none mt-3">700 Movimenti totalli</small> -->
          </div>
        </div>
        <div class="p-0 mt-3 h-full">
          <div class="intro-y col-span-12 overflow-auto 2xl:overflow-visible h-full">
            <!-- <table class="table table-report -mt-2">
                  <tbody>
                    <tr>
                      <td class="w-10 p-0"> -->
            <AccordionGroup selectedIndex="null">
              <AccordionItem v-for="(item, index) in items_t" :key="item" class="intro-x">
                <Accordion class="p-4 relative">
                  <input class="form-check-input mr-4 border-2" type="checkbox" :id="'Movimenti' + index"
                    @click="checkMovimenti(index, item.iddbmovimento, item.valuta_importo)" />
                  <b>{{ item.ragionesociale }}</b>
                  <ChevronDownIcon class="w-4 h-4 absolute right-4 top-5" />
                  <!-- <ChevronUpIcon class="w-4 h-4 absolute right-4 top-5" v-else-if="key === selectedIndex" /> -->
                </Accordion>
                <AccordionPanel class="text-slate-600 dark:text-slate-500 px-2">
                  <div class="w-11/12 mx-auto">
                    <table>
                      <tbody>

                        <tr>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.importo") }} : <b>{{ item.valuta_importo }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.data_doc") }} : <b>{{
                                moment(item.dataregistrazione).format("DD/MM/YYYY") }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.valuta") }} : <b>{{ item.valuta }}</b>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.id_mov") }} : <b>{{ item.iddbmovimento }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.data_op") }} : <b>{{
                                moment(item.dataregistrazione).format("DD/MM/YYYY") }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.conto") }} : <b>{{ item.conto }}</b>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.tipo_doc") }} : <b>{{ item.tipofile }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.testo_di_par") }} : <b>{{ item.sapid }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.nome_doc") }} : <b>{{
                                item.is_sottomovimento_con_supermovimento_aggregato }}</b>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="3" class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.note") }}: <b>{{ item.notemovimento }}</b>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="flex gap-4 justify-end mt-4">
                      <button id="searchDiv" class="btn mb-2 flex items-center gap-1 px-5 py-1"
                        @click="openDisattivaModal(true, item.is_movimento_disattivato, item.artificial_id_movimento);">
                        <SlashIcon class="w-4 h-4" />{{ $t("movimento_da_associare.disattiva") }}
                      </button>
                      <button id="searchDiv" class="btn mb-2 flex items-center gap-1 px-5 py-1"
                        @click="openModificaModal(true, item)">
                        <EditIcon class="w-4 h-4" />{{ $t("movimento_da_associare.modifica") }}
                      </button>
                      <button id="searchDiv" class="btn mb-2 flex items-center gap-1 px-5 py-1"
                        @click="openDoc(item.iddocumento)">
                        <FileTextIcon class="w-4 h-4" />{{ $t("movimento_da_associare.visualizza_doc") }}
                      </button>
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </AccordionGroup>
            <!-- </td>
                    </tr>
                  </tbody>
                </table> -->
          </div>
        </div>
      </div>
    </div>
    <div
      :class="(filterdiv == true) ? 'col-span-12 lg:col-span-2 relative top-1/3 h-40' : 'col-span-12 lg:col-span-2 relative top-1/3 h-40'">
      <div class="">
        <div class="rounded-full flex justify-center items-center w-24 h-4"></div>
        <div
          class="w-full flex justify-center border-b-2 border-slate-300 dark:border-darkmode-8Movimenti e sotto-movimenti00 mt-2 relative">
          <div
            class="bg-white dark:bg-darkmode-600 px-5 text-slate-500 w-24 h-24 rounded-full flex justify-center items-center -mt-8 absolute -top-4 package-box-block">
            <img alt="Enigma Tailwind HTML Admin Template" class="logo__image w-8"
              src="@/assets/images/big_match_manual.svg" />
          </div>
        </div>
      </div>
    </div>
    <div :class="(filterdiv == true) ? 'col-span-12 xl:col-span-5 flex h-full' : 'col-span-12 lg:col-span-4 h-full'">
      <div class="intro-y box float-left w-full h-full">
        <div class="border-b p-4">
          <div class="w-full intro-y col-span-12 flex flex-wrap sm:mt-0 sm:ml-auto md:ml-0 items-center mt-3">
            <h2 class="intro-y flex items-center">
              <b>{{ $t('movimento_da_associare.partite_heading') }}</b>
            </h2>
            <div class="form-check form-switch w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
              <label class="form-check-label ml-0" for="show-example-1">{{ $t('movimento_da_associare.toggle_heading')
              }}</label>
              <input @click="toggle" class="form-check-input mr-0 ml-3" type="checkbox" :disabled="validaPartite == 0"
                v-model="togglePartite" />
            </div>
          </div>
          <div class="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0">
            <!-- <small class="text-slate-500 font-medium leading-none mt-3">700 Movimenti totalli</small> -->
          </div>
        </div>
        <div class="p-0 mt-3 h-full">
          <div class="intro-y col-span-12 overflow-auto 2xl:overflow-visible h-full">
            <AccordionGroup selectedIndex="null">
              <AccordionItem v-for="(itemP, index) in items_p" :key="itemP" class="intro-x">
                <Accordion class="p-4 relative">
                  <input class="form-check-input  mr-4 border-2" type="checkbox" :id="'Partite' + index"
                    @click="checkPartite(itemP.iddb, index, itemP.importoparte)" />
                  <b>{{ itemP.ragionesociale }}</b>
                  <ChevronDownIcon class="w-4 h-4 absolute right-4 top-5" />
                </Accordion>
                <AccordionPanel class="text-slate-600 dark:text-slate-500">
                  <div class="w-11/12 mx-auto">
                    <table>
                      <tbody>
                        <tr>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.importo") }} : <b>{{ itemP.importoparte }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.id_doc") }} : <b>{{ itemP.iddocumento }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.sap_id") }} : <b>{{ itemP.sapid }}</b>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.data_scad") }} : <b>{{
                                moment(itemP.datascadenza).format("DD/MM/YYYY") }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.data_doc") }} : <b>{{
                                moment(itemP.datadocumento).format("DD/MM/YYYY") }}</b>
                            </div>
                          </td>
                          <td class="w-40">
                            <div class="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                              {{ $t("movimento_da_associare.testo_par") }} : <b>{{ itemP.testo_partita }}</b>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="flex gap-4 justify-end mt-4">
                      <button id="searchDiv" class="btn mr-2 mb-2 flex items-center gap-1 px-5 py-1"
                        @click="openPartiteDoc(itemP.iddocumento)">
                        <FileTextIcon class="w-4 h-4" />{{ $t("movimento_da_associare.visualizza_doc") }}
                      </button>
                    </div>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            </AccordionGroup>
          </div>
        </div>
      </div>
    </div>


    <!--End : Content-->
  </div>
  <!--End : Data List-->
  <!--begin delete confirmation-->
  <Modal :show="deleteConfirmationModal" @hidden="deleteConfirmationModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <AlertCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">{{ $t("movimento_da_associare.disattiva") }}</div>
        <div class="text-slate-500 mt-2">
          {{ $t("movimento_da_associare.disattiva_question") }}<br />{{ $t("movimento_da_associare.statement") }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="deleteConfirmationModal = false" class="btn btn-outline-secondary w-24 mr-1">
          {{ $t("match_validati_details.Annula") }}
        </button>
        <button type="button" class="btn btn-danger w-24" @click="deactivate()">{{ $t("movimento_da_associare.disattiva")
        }}</button>
      </div>
    </ModalBody>
  </Modal>
  <!--end delete confirmation-->
  <!--Begin : Modifa Modal-->
  <Modal :show="modificaModal" @hidden="modificaModal = false">
    <ModalBody class="p-0">
      <div class="p-5">
        <div class="text-3xl mt-5">
          {{ $t("movimento_da_associare.modifica_heading") }}?
        </div>
      </div>
      <div class="border-y-2">
        <div class="p-5">
          <div class="text-slate-500 mt-2">
            {{
              $t(
                "movimento_da_associare.modifica_statement"
              )
            }}
          </div>
          <div>
            <PreviewComponent v-slot="{ toggle }">

              <div class="mb-3">
                <Preview>
                  <!-- <div class="text-center"> -->
                  <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                    <DropdownToggle class="btn bg-white w-full flex justify-between">
                      {{ stakeData.name }}
                      <ChevronDownIcon class="w-4 h-4 ml-2" />
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownContent>
                        <DropdownItem v-for="tipi in stakeHolders" :key="tipi.id"
                          @click="onChangeStakeData(tipi.id, tipi.ragionesociale)">{{ tipi.ragionesociale }}
                        </DropdownItem>
                      </DropdownContent>
                    </DropdownMenu>
                  </Dropdown>
                  <!-- </div> -->
                </Preview>
              </div>
            </PreviewComponent>

          </div>
        </div>
      </div>
      <div class="px-5 pt-5 pb-8 text-end">
        <button type="button" @click="modificaModal = false" class="btn btn-secondary w-24 mr-1">
          {{ $t("documenti_da_validare.Annulla") }}
        </button>
        <button type="button" class="btn btn-primary w-24" @click="cambiaRS">
          {{ $t("movimento_da_associare.modifica") }}
        </button>
      </div>
    </ModalBody>
  </Modal>
  <!--End : Modifa Modal-->
  <!--Begin : Visualizza-->
  <!--Movimenti Doc-->
  <DocOpened v-if="showMovimentoDoc" :idDoc="idDoc" @close="closeModal()">
  </DocOpened>
  <!--End Movimento Doc-->
  <!--Partite Doc-->
  <DocOpened v-if="showPartiteDoc" :idDoc="idPDoc" @close="closePartiteModal()">
  </DocOpened>
  <!--End Movimento Doc-->
  <!--End : Visualizza-->
  <!--BEGIN: Auto Match Valida-->
  <Modal :show="autoMatchModal" @hidden="autoMatchModal = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <CheckCircleIcon class="w-16 h-16 text-primary mx-auto mt-3" />
        <div class="text-3xl mt-5">{{ $t("movimento_da_associare.valida_match") }}</div>
        <div class="text-slate-500 mt-2">
          {{$t("automatici_da_validar.valida_match_heading1")}}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button type="button" @click="autoMatchModal = false" class="btn btn-outline-secondary w-24 mr-1">
          {{ $t("match_validati_details.Annula") }}
        </button>
        <button type="button" class="btn btn-primary w-24" @click="matchValida()">{{ $t("documenti_da_validare.Valida")
        }}</button>
      </div>
    </ModalBody>
  </Modal>
  <!--END: Auto Match Valida-->
  <!--BEGIN: Manual Match Valida functionality-->
  <Modal class="validaMatch" :show="manualMatchModal" @hidden="manualMatchModal = false">
    <ModalBody class="p-0">

      <div class="flex justify-between items-center border-b p-4">
        <h4 class="text-xl">{{ $t("movimento_da_associare.valida_match") }}</h4>
        <div class="text-right">{{$t("automatici_da_validar.saldo_iniziale")}}: <span> {{ saldo }}</span></div>
      </div>
      <div class="p-4">
        <p class="text-slate-500 mb-4">
          {{$t("automatici_da_validar.valida_match_heading2")}}:
        </p>
      </div>
      <div v-if="addDifferenze.length > 0" class="p-4" v-for="(add, index) in addDifferenze">

        <div class="sm:flex items-center">
          <!-- BEGIN: Dropdown with close button -->
          <PreviewComponent class="sm:w-1/3" v-slot="{ toggle }">
            <Preview>
              <!-- <div class="text-center"> -->
              <Dropdown class="" placement="bottom-start" v-slot="{ dismiss }">
                <DropdownToggle class="btn bg-white w-full flex justify-between">
                  {{ add.nomeconto['nomecontoD'] }}
                  <ChevronDownIcon class="w-4 h-4 ml-2" />
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownContent>
                    <DropdownItem v-for="tipi in differenzePartiteCodici" :key="tipi.codicesapconto"
                      @click="onChangeCodice(tipi.codicesapconto, tipi.nomeconto, add)">{{
                        tipi.nomeconto }}
                    </DropdownItem>
                  </DropdownContent>
                </DropdownMenu>
              </Dropdown>
              <!-- </div> -->
            </Preview>
          </PreviewComponent>
          <!-- END: Dropdown with close button -->
          <div class="w-12 flex-none xl:flex-initial sm:w-1/4 text-center">{{$t("automatici_da_validar.value")}}</div>
          <input id="tabulator-html-filter-value" type="number" class="form-control sm:w-1/3 mt-2 sm:mt-0" placeholder=""
            v-model="add.differenzeValue" :disabled="!(add.nomeconto['codicesapconto'] != '')" />
          <MinusCircleIcon class="w-7 h-8 text-primary ml-auto" @click="RemoveDifferenzeItem(add)" />
        </div>
      </div>
      <div class="p-4">
        <div class="sm:flex items-center mt-4">
          <PlusCircleIcon class="w-7 h-8 text-primary ml-auto" @click="AddDifferenzeItem()" />
        </div>
      </div>
      <div class="p-4 text-right border-t">
        <p class="text-slate-500 mb-4 w-full">
          {{$t("automatici_da_validar.saldo_final")}} : {{ saldoFinal }}
        </p>
        <button type="button" @click="manualMatchModal = false" class="btn btn-outline-secondary w-24 mr-4">
          {{ $t("match_validati_details.Annula") }}
        </button>
        <button type="button" :disabled="!btnValidaDisable" class="btn btn-primary w-24" @click="matchValida()">{{
          $t("documenti_da_validare.Valida") }}</button>
      </div>
    </ModalBody>
  </Modal>
  <!--END: Manual Match Valida-->
</template>
<script setup>
import { ref, watch, onMounted, onBeforeMount, computed } from "vue";
import VueTailwindDatepicker from "vue-tailwind-datepicker";
import { useMatchStore } from "@/stores/match";
import DocOpened from '@/components/document/Main.vue'

import moment from "moment";
import { DropdownToggle } from "../../global-components/dropdown";
const matchStore = useMatchStore();
const filterName = ref("Mostra Filtri");
const filterdiv = ref(true);
const active = ref(false);
const validaMatch = ref(0);
const validaPartite = ref(0);
const toggleMovimento = ref(false);
const togglePartite = ref(false);
const items_t = ref();
const items_p = ref();
const ragione = ref('');
const ragioneP = ref('')
const sapid = ref('');
const conto = ref('')
const ancheDisattivati = ref(false)
const includiAbbinati = ref(false)
const deleteConfirmationModal = ref(false)
const disattiva = ref();
const artificial_id_movimento = ref('');
const modificaModal = ref(false)
const stakeHolders = ref();
const ragioneSocialeConfermata = ref(false)
const madificaSapID = ref();
const documentoDaCercare = ref({
  iddb: "",
  descrizione: "Tipo Documento",
});
const stakeData = ref({
  id: "Ragione Sociale",
  name: "Select a Ragione Sociale",
});
const annoOption = ref(['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014'])
const anno = ref("Anno");
const tipidocumento = ref(null)
const valuta = ref("Valuta");
const valutaP = ref('Valuta');
const mese = ref({
  id: "Mese",
  desc: "Mese",
});
const meseOption = ref([{
  id: 1,
  desc: "Gennaio",
}, {
  id: 2,
  desc: "Febbraio",
}, {
  id: 3,
  desc: "Marzo",
}, {
  id: 4,
  desc: "Aprile",
}, {
  id: 5,
  desc: "Maggio",
}, {
  id: 6,
  desc: "Giugno",
}, {
  id: 7,
  desc: "Luglio",
}, {
  id: 8,
  desc: "Agosto",
}, {
  id: 9,
  desc: "Settembre",
}, {
  id: 10,
  desc: "Ottobre",
}, {
  id: 11,
  desc: "Novembre",
}, {
  id: 12,
  desc: "Dicembre",
}]);
const showMovimentiFilters = ref(false)
const showPartiteFilters = ref(false)
const showMoviPlus = ref(true)
const showPartitePlus = ref(true)
const filterDataOpera = ref("")
const filterDataCreazione = ref("")
const filterDataScandenza = ref("")
const dDate = (date) => {
  return date > new Date();
};
const datepickerFormatter = { date: "YYYY-MM-DD", month: "MMM" };
const currentPage = ref(1);
const perPageRecords = ref(10);
const showMovimentoDoc = ref(false)
const idDoc = ref("");
const showPartiteDoc = ref(false)
const idPDoc = ref("")
const selectedMovimento = ref()
const selectedPartite = ref([])
const moviIndex = ref();
//for calcuation of saldo i.e (movimento's import - sum of partite's importo), taking 2 variable
const movimentoImporto = ref(0);
const partiteImporto = ref(0);
const saldo = ref('-');
const autoMatchModal = ref(false);
const manualMatchModal = ref(false)
const addDifferenze = ref([]);
const differenzePartiteCodici = ref([])
const btnValidaDisable = ref(false)
const saldoFinal = ref('')
onBeforeMount(async () => {
  await matchStore.LoadContiDifferenzeIncassiPartite()
  differenzePartiteCodici.value = matchStore.contiDifferenzeIncassiPartite;
  console.log("###########:    ", differenzePartiteCodici.value)
})
saldoFinal.value = computed(() => {
  let final = Number(saldo.value) + Number(differenzaTotale())
  if (final == 0) {

    btnValidaDisable.value = true
  } else {
    btnValidaDisable.value = false
  }

  return final
})
onMounted(async () => {
  await matchStore.LoadTipoDocumenti();
  await matchStore.LoadStakeholders(null);
  getMovimentiData();
  getPartiteData();

  tipidocumento.value = matchStore.tipiDocumento
  tipidocumento.value.unshift({
    descrizione: "Tutti",
    iddb: "0",
  });
  console.log(tipidocumento.value)
  //debugger
  let arra = matchStore.stakeholders;
  stakeHolders.value = arra.items;



});
watch(
  filterdiv,
  (newValue) => {
    if (newValue == true) {
      active.value = false;
      filterName.value = "Mostra Filtri";
    } else {
      active.value = true;
      filterName.value = "Nascondi Filtri";
    }
  },
  {
    immediate: true,
  }
);
watch(
  toggleMovimento,
  (newValue) => {
    if (newValue == true) {
      //show the selected value for movimenti
      if (selectedMovimento.value != undefined) {
        let items = items_t.value.filter(movi => ((movi.iddbmovimento) === selectedMovimento.value))
        items_t.value = items
      }
    } else {
      getMovimentiData()
      validaMatch.value = 0
    }
  }
);
watch(
  togglePartite,
  (newValue) => {
    if (newValue == true) {
      console.log("Hey whats in selected partite ??   ", selectedPartite.value)
      //show the selected value for partite
      if (selectedPartite.value != undefined) {
        let items = items_p.value.filter(function (item) {
          return selectedPartite.value.indexOf(item.iddb) !== -1;
        });

        items_p.value = items

      }
    } else {
      validaPartite.value = 0
      getPartiteData()

    }
  }
);

function onChangeTipiDocumento(id, desc) {
  console.log(id + ' - ' + desc);
  documentoDaCercare.value.iddb = id
  documentoDaCercare.value.descrizione = desc
}
function openDoc(anIdDocumento) {

  console.log("Documenti: " + anIdDocumento);
  idDoc.value = anIdDocumento;
  console.log("idDoc: " + idDoc.value);
  showMovimentoDoc.value = true;
}
function openPartiteDoc(anIdDocumento) {

  console.log("Documenti: " + anIdDocumento);
  idPDoc.value = anIdDocumento;
  console.log("idDoc: " + idDoc.value);
  showPartiteDoc.value = true;
}
function onChangeAnno(year) {
  console.log(year);
  anno.value = year
}
function onChangeMese(id, month) {
  console.log(month);
  mese.value.id = id
  mese.value.desc = month
}
async function getMovimentiData() {
  let params = new URLSearchParams()
  params.append("page", currentPage.value);
  params.append("size", 9999);
  //tipo
  if (documentoDaCercare.value.descrizione == 'Tipo Documento' || documentoDaCercare.value.iddb == '0') {

  }
  else {
    params.append("tipo_doc_id", documentoDaCercare.value.iddb);
  }
  //anno
  if (anno.value != 'Anno') {
    params.append("anno", anno.value);
  }else{
    params.append("anno", -1);
  }
  //mese
  if (mese.value.id != 'Mese') {
    params.append("mese", mese.value.id);
  }else{
    params.append("mese", -1);
  }
  //ragionesociale
  if (ragione.value != "") {
    params.append("ragionesociale", ragione.value);
  }
  //dataOpera
  if (filterDataOpera._rawValue.length > 0) {

    let dateSplit = filterDataOpera._rawValue.toString().trim().split('~');
    params.append("dataoperazioneda", moment(dateSplit[0]).format("YYYY-MM-DDTHH:MM:SS"));
    params.append("dataoperazionea", moment(dateSplit[1]).format("YYYY-MM-DDTHH:MM:SS"));
  }
  //valuta
  if (valuta.value != "Valuta" && valuta.value != "All") {
    if (valuta.value == 'Euro') {
      params.append("valuta", "EUR");
    } else {
      params.append("valuta", valuta.value);
    }
  }
  //conto
  if (conto.value != "") {
    params.append("conto", conto.value);
  }
  // parameters refered from old code and new api
  params.append("importo", -1)
  params.append("importoda", -1)
  params.append("importoa", -1)
  params.append("id_bonifico", -1)
  params.append("id_dettaglio_movimento_bancario",-1)
  params.append("includi_disattivati_manualmente", ancheDisattivati.value);
  params.append("includi_sottomovimenti_senza_movimento", false);
  params.append("escludi_coinvolti_in_match", !includiAbbinati.value);
  params.append("includi_movimenti_coinvolti_in_match_confermati_manualmente", false);

  var newObj = {
    params: params,
    soloAperti: false,
  };
  await matchStore.LoadMovimenti(newObj)
  console.log(matchStore.movimenti.items)
  items_t.value = matchStore.movimenti.items;
  // debugger
}
async function getPartiteData() {
  let params = new URLSearchParams()
  params.append("page", currentPage.value);
  params.append("size", perPageRecords.value);
  //ragionesociale
  if (ragioneP.value != "") {
    params.append("ragionesociale", ragioneP.value);
  }
  //sapid
  if (sapid.value != "") {
    params.append("sapid", sapid.value)
  }
  //dataCreazione
  if (filterDataCreazione._rawValue.length > 0) {

    let dateSplit = filterDataCreazione._rawValue.toString().trim().split('~');
    params.append("datadocumentoda", moment(dateSplit[0]).format("YYYY-MM-DDTHH:MM:SS"));
    params.append("datadocumentoa", moment(dateSplit[1]).format("YYYY-MM-DDTHH:MM:SS"));
  }
  //dataScandenza
  if (filterDataScandenza._rawValue.length > 0) {

    let dateSplit = filterDataScandenza._rawValue.toString().trim().split('~');
    params.append("datascadenzada", moment(dateSplit[0]).format("YYYY-MM-DDTHH:MM:SS"));
    params.append("datascadenzaa", moment(dateSplit[1]).format("YYYY-MM-DDTHH:MM:SS"));
  }
  //valutaP
  if (valutaP.value != "Valuta" && valutaP.value != "All") {
    if (valutaP.value == 'Euro') {
      params.append("valuta", "EUR");
    } else {
      params.append("valuta", valutaP.value);
    }
  }

  var newObj = {
    params: params,
    soloAperti: false,
  };
  await matchStore.LoadPartite(newObj)
  console.log(matchStore.partite.items)
  items_p.value = matchStore.partite.items;
  // debugger
}
function checkMovimenti(index, moviIddb, mImporto) {
  if (moviIndex.value != index) {
    for (var i = 0; i < items_t.value.length; i++) {
      document.getElementById("Movimenti" + i).checked = false;


    }
    document.getElementById("Movimenti" + index).checked = true;
    movimentoImporto.value = mImporto
    selectedMovimento.value = moviIddb;
  } else {
    for (var i = 0; i < items_t.value.length; i++) {
      document.getElementById("Movimenti" + i).checked = false;

    }
    selectedMovimento.value = undefined
    movimentoImporto.value = 0
  }

  moviIndex.value = index

  if (selectedMovimento.value == undefined) {
    validaMatch.value = 0
    toggleMovimento.value = false
  } else {
    validaMatch.value = 1
  }
  console.log("Movimento Importo : ", movimentoImporto.value)
  if (movimentoImporto.value != 0) {
    saldo.value = movimentoImporto.value - partiteImporto.value

  } else {
    saldo.value = '-'
  }
}
const calc = ref([])
function checkPartite(iddb, index, pImporto) {

  if (selectedPartite.value.includes(iddb)) {
    const index = selectedPartite.value.indexOf(iddb)
    if (index > -1) {
      selectedPartite.value.splice(index, 1)
      calc.value.splice(index, 1)
    }
  } else {
    selectedPartite.value[selectedPartite.value.length] = iddb
    calc.value[selectedPartite.value.length] = pImporto

  }
  console.log(selectedPartite.value)
  console.log(calc.value)
  let result = 0
  calc.value.forEach(number => {
    result += number;
  })
  console.log("result: " + result)
  partiteImporto.value = result

  if (selectedPartite.value.length == 0) {
    validaPartite.value = 0
    togglePartite.value = false
  } else {
    validaPartite.value = 1
  }

  if (movimentoImporto.value != 0) {
    saldo.value = movimentoImporto.value - partiteImporto.value

  } else {
    saldo.value = '-'
  }
}
async function deactivate() {

  if (disattiva) {
    await matchStore.UpdateMovimento({
      idMov: artificial_id_movimento.value,
      op: "attiva",
    })

  } else {
    await matchStore.UpdateMovimento({
      idMov: artificial_id_movimento.value,
      op: "disattiva",
    })

  }

  getMovimentiData();
  deleteConfirmationModal.value = false
}
function applyFilters() {
  getMovimentiData();
  getPartiteData();
}
function reset() {
  documentoDaCercare.value = {
    iddb: "",
    descrizione: "Tipo Documento"
  };
  anno.value = "Anno";
  mese.value = {
    id: "Mese",
    desc: "Mese",
  }
  ragione.value = ''
  filterDataOpera.value = ''
  valuta.value = 'Valuta'
  conto.value = ''
  ragioneP.value = ''
  filterDataScandenza.value = ''
  filterDataCreazione.value = ''
  sapid.value = ''
  getPartiteData();
  getMovimentiData();
}
function onChangeStakeData(id, name) {
  stakeData.value.id = id;
  stakeData.value.name = name;
}
function openDisattivaModal(param1, param2, param3) {


  deleteConfirmationModal.value = param1;
  disattiva.value = param2;
  artificial_id_movimento.value = param3
}
function openModificaModal(param1, sapidDetail) {
  modificaModal.value = param1
  madificaSapID.value = sapidDetail

}
async function cambiaRS() {

  console.log("Scelta nuova ragione sociale");
  ragioneSocialeConfermata.value = true;
  //update movimenti's ragione sociale
  await matchStore.UpdateMovimento({ idMov: madificaSapID.value.artificial_id_movimento, op: "cambiaRS", idStakeholder: stakeData.value.id });
  modificaModal.value = false;
  //load data after update for refelecting the change
  getMovimentiData()
  stakeData.value.id = "Ragione Sociale";
  stakeData.value.name = "Select a Ragione Sociale";

}
function closeModal() {
  showMovimentoDoc.value = false
}
function closePartiteModal() {
  showPartiteDoc.value = false
}
function setMatchValidaModal() {

  if (saldo.value != "-" && saldo.value != 0) {
    manualMatchModal.value = true
    autoMatchModal.value = false
  } else {
    autoMatchModal.value = true
    manualMatchModal.value = false
  }
}
function AddDifferenzeItem() {
  addDifferenze.value.push({ nomeconto: { nomecontoD: "Codice", codicesapconto: "" }, differenzeValue: '' })
}
function RemoveDifferenzeItem(item) {
  let rindex = addDifferenze.value.indexOf(item)
  addDifferenze.value.splice(rindex, 1)
  console.log("Removed!! Remaining array length:    ", addDifferenze.value.length)
}
function differenzaTotale() {
  let differenzaTotale = 0;
  console.log(addDifferenze.value);
  for (const item of addDifferenze.value) {

    console.log("Codice: " + item.nomeconto.codicesapconto)
    if (item.nomeconto.codicesapconto && (item.nomeconto.codicesapconto != "")) {
      console.log("Passato: " + item.nomeconto.codicesapconto + "  differenzeValue === " + item.differenzeValue)
      if (segnoPerCodice(item) === "+") {
        console.log("==============", item.differenzeValue)
        differenzaTotale += Number(item.differenzeValue);
      } else {
        console.log("88888888888888 ", item.differenzeValue)
        differenzaTotale -= Number(item.differenzeValue);
      }
    }
  }
  //return 0
  console.log("---------------------------------------->>", differenzaTotale)
  return differenzaTotale;
}
function segnoPerCodice(item) {
  console.log("Segno per codice: " + item.nomeconto.codicesapconto + " with " + differenzePartiteCodici.value);
  if (
    differenzePartiteCodici.value.find(differenza => {
      return differenza.codicesapconto === item.nomeconto.codicesapconto;
    }
    )
    &&
    differenzePartiteCodici.value.find(differenza => {
      return differenza.codicesapconto === item.nomeconto.codicesapconto;
    }).iscontoinavere
  ) {
    return "-";
  } else {
    return "+"
  }
}
function differenzeSintetiche() {
  let diffrenzeDaInviare = [];
  for (const item of addDifferenze.value) {

    const cod_sap = item.nomeconto.codicesapconto;

    let cod = differenzePartiteCodici.value
      .find(diff => diff.codicesapconto === cod_sap)
      .codiceinternoconto;
    let importo = item.differenzeValue;
    //let id = item.idPartita;
    let diff = {};

    diff = { cod, importo };

    console.log(diff);
    diffrenzeDaInviare.push(diff);

  }
  return diffrenzeDaInviare;
}

function onChangeCodice(id, name, add) {
  console.log(id, name, add)

  add.nomeconto.nomecontoD = name
  add.nomeconto.codicesapconto = id
}
async function matchValida() {

  let differenze = [];
  if (saldo.value != "-" && saldo.value != 0) {
    differenze = differenzeSintetiche()
  }

  let listaMovimenti = [];
  let items = items_t.value.filter(movi => ((movi.iddbmovimento) === selectedMovimento.value))

  listaMovimenti.push(items[0].artificial_id_movimento)


  let creaEChiudi = {
    listaPartite: selectedPartite.value,
    listaMovimenti: listaMovimenti,
    differenze: differenze
  }

  await matchStore.CreaESalvaMatch(creaEChiudi)
  console.log("*************", creaEChiudi)
  manualMatchModal.value = false;
  autoMatchModal.value = false;
  addDifferenze.value = []
  getMovimentiData();
  getPartiteData();
  saldo.value = '-'
}
</script>
<style>
.filter-btn svg {
  transform: rotate(90deg);
}

::placeholder {
  color: #333 !important;
  font-weight: 500;
  font-size: 14px !important;
}

.input-text-color svg {
  color: #333
}

.accordion .accordion-item:last-child {
  margin-bottom: 0 !important;
  border-bottom: 1px solid #eef1f6 !important;
  margin-bottom: 20px !important;
}
</style>
