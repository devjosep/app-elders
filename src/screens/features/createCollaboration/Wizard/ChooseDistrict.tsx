import React, { Suspense, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, Touchable } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeCall } from 'utils';

import { doFetch, navigate, useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { useWizardStatus } from 'stores/wizardStore';
import { useQuery } from 'react-query';
import { District, DistrictWithQuarters, getDistricts, getLocations } from '@client/common/src/location';
import { Checkbox, Loading } from '@client/ui-components/src/components';
import { LocationFilterItem } from './LocationFilterItem';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ChevronOpenIcon from 'icons/chevronDown.svg';
import ChevronCloseIcon from 'icons/chevronUp.svg';
import { FF, FS, RADIUS } from '@client/ui-components/src/theme/global';

const ChooseDistrictList = () => {const { theme, role, constants } = useTheme();
const [areQuartersVisible, setQuartersVisible] = useState(false);
const [District, setDistrict] = useState("");
const [id, setiD] = useState({});
const styles = buildStyles({ theme });
const user = useAuth((state) => state.user);
const { accessibility } = useAccessibilityAutoFocus();



const navigation =
  useNavigation<StackNavigationProp<RouteParams, 'ChooseDistrict'>>();

  const routeChange = () =>{ 
    let path = `ChooseQuarter`; 
    navigate(path,id);
  }
  const  data  =
   [{codigo: 1, nombre:"CENTRO",quarters:[{ id: 1, nombre:"PALACIO",  distrito:1},
   { id: 2, nombre:"EMBAJADORES",  distrito:1},
   { id: 3, nombre:"CORTES",  distrito:1}, 
   { id: 4, nombre:"JUSTICIA",  distrito:1},
   { id: 5, nombre:"UNIVERSIDAD",  distrito:1},
   { id: 6, nombre:"SOL",  distrito:1}]},
  {codigo: 2, nombre:"ARGANZUELA",quarters:[{ id: 7, nombre:"IMPERIAL",  distrito:2},
  { id: 8, nombre:"ACACIAS",  distrito:2},
  { id: 9, nombre:"CHOPERA",  distrito:2},
  { id: 10, nombre:"LEGAZPI",  distrito:2},
  { id: 11, nombre:"DELICIAS",  distrito:2},
  { id: 12, nombre:"PALOS DE LA FRONTERA",  distrito:2},
  { id: 13, nombre:"ATOCHA",  distrito:2}]}
  ,{codigo: 3, nombre:"RETIRO",quarters:[{ id: 14, nombre:"PACIFICO",  distrito:3},
  { id: 15, nombre:"ADELFAS",  distrito:3},
  { id: 16, nombre:"ESTRELLA",  distrito:3},
  { id: 17, nombre:"IBIZA",  distrito:3},
  { id: 18, nombre:"LOS JERONIMOS",  distrito:3},
  { id: 19, nombre:"NIÑO JESUS",  distrito:3}]},
  {codigo: 4, nombre:"SALAMANCA",quarters:[{ id: 20, nombre:"RECOLETOS",  distrito:4},
  { id: 21, nombre:"GOYA",  distrito:4},
  { id: 22, nombre:"FUENTE DEL BERRO",  distrito:4},
  { id: 23, nombre:"GUINDALERA",  distrito:4},
  { id: 24, nombre:"LISTA",  distrito:4},
  { id: 25, nombre:"CASTELLANA",  distrito:4}]},
  {codigo: 5, nombre:"CHAMARTIN",quarters:[{ id: 26, nombre:"EL VISO",  distrito:5},
  { id: 27, nombre:"PROSPERIDAD",  distrito:5},
  { id: 28, nombre:"CIUDAD JARDIN",  distrito:5},
  { id: 29, nombre:"HISPANOAMERICA",  distrito:5},
  { id: 30, nombre:"NUEVAESPAÑA",  distrito:5},
  { id: 31, nombre:"CASTILLA",  distrito:5}]},
  {codigo: 6, nombre:"TETUAN",quarters:[{ id: 32, nombre:"BELLAS VISTAS",  distrito:6},
  { id: 33, nombre:"CUATRO CAMINOS",  distrito:6},
  { id: 34, nombre:"CASTILLEJOS",  distrito:6},
  { id: 35, nombre:"ALMENARA",  distrito:6},
  { id: 36, nombre:"VALDEACEDERAS",  distrito:6},
  { id: 37, nombre:"BERRUGUETE",  distrito:6}]},
  {codigo: 7, nombre:"CHAMBERI",quarters:[{ id: 38, nombre:"GAZTAMBIDE",  distrito:7},
  { id: 39, nombre:"ARAPILES",  distrito:7},
  { id: 40, nombre:"TRAFALGAR",  distrito:7},
  { id: 41, nombre:"ALMAGRO",  distrito:7},
  { id: 42, nombre:"RIOS ROSAS",  distrito:7},
  { id: 43, nombre:"VALLEHERMOSO",  distrito:7}]}
  ,{codigo: 8, nombre:"FUENCARRAL-EL PARDO",quarters:[  { id: 44, nombre:"EL PARDO",  distrito:8},
  { id: 45, nombre:"FUENTELARREINA",  distrito:8},
  { id: 46, nombre:"PEÑA GRANDE",  distrito:8},
  { id: 47, nombre:"EL PILAR",  distrito:8},
  { id: 48, nombre:"LA PAZ",  distrito:8},
  { id: 49, nombre:"VALVERDE",  distrito:8},
  { id: 50, nombre:"MIRASIERRA",  distrito:8},
  { id: 51, nombre:"EL GOLOSO",  distrito:8}]},
  {codigo: 9, nombre:"MONCLOA-ARAVACA",quarters:[  { id: 52, nombre:"CASA DE CAMPO",  distrito:9},
  { id: 53, nombre:"ARGUELLES",  distrito:9},
  { id: 54, nombre:"CIUDAD UNIVERSITARIA",  distrito:9},
  { id: 55, nombre:"VALDEZARZA",  distrito:9},
  { id: 56, nombre:"VALDEMARIN",  distrito:9},
  { id: 57, nombre:"EL PLANTIO",  distrito:9},
  { id: 58, nombre:"ARAVACA",  distrito:9}]},
  {codigo: 10, nombre:"LATINA",quarters:[{ id: 59, nombre:"LOS CARMENES",  distrito:10},
  { id: 60, nombre:"PUERTA DEL ANGEL",  distrito:10},
  { id: 61, nombre:"LUCERO",  distrito:10},
  { id: 62, nombre:"ALUCHE",  distrito:10},
  { id: 63, nombre:"CAMPAMENTO",  distrito:10},
  { id: 64, nombre:"CUATRO VIENTOS",  distrito:10},
  { id: 65, nombre:"LAS AGUILAS",  distrito:10}]},
  {codigo: 11, nombre:"CARABANCHEL",quarters:[{ id: 66, nombre:"COMILLAS",  distrito:11},
  { id: 67, nombre:"OPAÑEL",  distrito:11},
  { id: 68, nombre:"SAN ISIDRO",  distrito:11},
  { id: 69, nombre:"VISTA ALEGRE",  distrito:11},
  { id: 70, nombre:"PUERTA BONITA",  distrito:11},
  { id: 71, nombre:"BUENAVISTA",  distrito:11},
  { id: 72, nombre:"ABRANTES",  distrito:11}]},
  {codigo: 12, nombre:"USERA",quarters:[ { id: 73, nombre:"ORCASITAS",  distrito:12},
  { id: 74, nombre:"ORCASUR",  distrito:12},
  { id: 75, nombre:"SAN FERMIN",  distrito:12},
  { id: 76, nombre:"ALMENDRALES",  distrito:12},
  { id: 77, nombre:"MOSCARDO",  distrito:12},
  { id: 78, nombre:"ZOFIO",  distrito:12},
  { id: 79, nombre:"PRADOLONGO",  distrito:12}]}
  ,{codigo: 13, nombre:"PUENTE VALLECAS",quarters:[  { id: 80, nombre:"ENTREVIAS",  distrito:13},
  { id: 81, nombre:"SANDIEGO",  distrito:13},
  { id: 82, nombre:"PALOMERAS BAJAS",  distrito:13},
  { id: 83, nombre:"PALOMERAS SURESTE",  distrito:13},
  { id: 84, nombre:"PORTAZGO",  distrito:13},
  { id: 85, nombre:"NUMANCIA",  distrito:13}]},
  {codigo: 14, nombre:"MORATALAZ",quarters:[{ id: 86, nombre:"PAVONES",  distrito:14},
  { id: 87, nombre:"HORCAJO",  distrito:14},
  { id: 88, nombre:"MARROQUINA",  distrito:14},
  { id: 89, nombre:"MEDIALEGUA",  distrito:14},
  { id: 90, nombre:"FONTARRON",  distrito:14},
  { id: 91, nombre:"VINATEROS",  distrito:14}]},
  {codigo: 15, nombre:"CIUDAD LINEAL",quarters:[{ id: 92, nombre:"VENTAS",  distrito:15},
  { id: 93, nombre:"PUEBLO NUEVO",  distrito:15},
  { id: 94, nombre:"QUINTANA",  distrito:15},
  { id: 95, nombre:"CONCEPCION",  distrito:15},
  { id: 96, nombre: "SAN PASCUAL",  distrito:15},
  { id: 97, nombre:"SAN JUAN  BAUTISTA",  distrito:15},
  { id: 98, nombre:"COLINA",  distrito:15},
  { id: 99, nombre:"ATALAYA",  distrito:15},
  { id: 100, nombre:"COSTILLARES",  distrito:15}]},
  {codigo: 16, nombre:"HORTALEZA",quarters:[{ id: 101, nombre:"PALOMAS",  distrito:16},
  { id: 102, nombre:"PIVONERA",  distrito:16},
  { id: 103, nombre:"CANILLAS",  distrito:16},
  { id: 104, nombre:"PINAR DEL REY",  distrito:16},
  { id: 105, nombre:"APOSTOL SANTIAGO",  distrito:16},
  { id: 106, nombre:"VALDEFUENTES",  distrito:16}]},
  {codigo: 17, nombre:"VILLAVERDE",quarters:[ { id: 107, nombre:"VILLAVERDE ALTO C.H",  distrito:17},
  { id: 108, nombre:"SAN CRISTOBAL",  distrito:17},
  { id: 109, nombre:"BUTARQUE",  distrito:17},
  { id: 110, nombre:"LOS ROSALES",  distrito:17},
  { id: 111, nombre:"LOS ANGELES",  distrito:17}]},
  {codigo: 18, nombre:"VILLA DE VALLECAS",quarters:[  { id: 112, nombre:"CASCO H.VALLECAS",  distrito:18},
  { id: 113, nombre:"SANTA EUGENIA",  distrito:18},
  { id: 114, nombre:"ENSANCHE DE VALLECAS",  distrito:18}]},
  {codigo: 19, nombre:"VICÁLAVARO",quarters:[{ id: 115, nombre:"CASCO H.VICALVARO",  distrito:19},
  { id: 116, nombre:"VALDEBERNARDO",  distrito:19},
  { id: 117, nombre:"VALDERRIVAS",  distrito:19},
  { id: 118, nombre:"EL CAÑAVERAL",  distrito:19}]},
  {codigo: 20, nombre:"SAN BLAS",quarters:[{ id: 119, nombre:"SIMANCAS",  distrito:20},
  { id: 120, nombre:"HELLIN",  distrito:20},
  { id: 121, nombre:"AMPOSTA",  distrito:20},
  { id: 122, nombre:"ARCOS",  distrito:20},
  { id: 123, nombre:"ROSAS",  distrito:20},
  { id: 124, nombre:"REJAS",  distrito:20},
  { id: 125, nombre:"CANILLEJAS",  distrito:20},
  { id: 126, nombre:"EL SALVADOR",  distrito:20}]},
  {codigo: 21, nombre:"BARAJAS",quarters:[  { id: 127, nombre:"ALAMEDA DE OSUNA",  distrito:21},
  { id: 128, nombre:"AEROPUERTO",  distrito:21},
  { id: 129, nombre:"CASCO H.BARAJAS",  distrito:21},
  { id: 130, nombre:"TIMON",  distrito:21},
  { id: 131, nombre:"CORRALEJOS",  distrito:21}]}]
 


  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 16 }}
        data={data}
        renderItem={({ item }) => (
          <View style={styles.container}>
          <TouchableOpacity
          style={styles.collapsedContainer}
          activeOpacity={1}
           >
           
          <Text>{item.nombre}</Text>
          <Text
            {...accessibility(
              {
                label: `Distrito ${item.nombre}. Barrios seleccionados:v `,
                state: {
                  expanded: areQuartersVisible
                }
              },
              { accessible: true }
            )}
            style={[
              styles.textHeader,
             
            ]}
            numberOfLines={1}
            lineBreakMode='tail'
          >
              
          </Text>
          <Checkbox 
          {...accessibility(
            {
              label: `Filtrar por todo el distrito de ${item.nombre}`,
              state: { selected: true }
            },
            { accessible: true }
          )
         }
          defaultValue={false}
          onPress={() => {
           setDistrict(item.nombre)
           setiD(item)
           console.log(District)
          }
          }
          
        />
          </TouchableOpacity>
         
      </View>
      
      
               
     
        )}
        keyExtractor={(item, index) => `${item.codigo.toString()}_${index}`}
      />
      <View style={styles.buttonView}>
        <Button
          {...accessibility(
            {
              label: 'Actualizar resultados',
              hint: 'Actualizar resultados y volver a la busqueda de peticiones',
              role: 'button'
            },
            { accessible: true }
          )}
          text={"Seleccionar " + District}
          onPress={() => {
            routeChange();
          
          }}
        />
      </View>
    </View>
  );
};
const ChooseDistrict = () => (
  <Suspense fallback={<Loading />}>
    <ChooseDistrictList />
  </Suspense>
);


export default ChooseDistrict;


const buildStyles = ({ theme }: Pick<BuildStyles, 'theme'>) =>
  StyleSheet.create({
    list: {
      width: '100%',
      marginTop: 24
    },
    container: {
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: theme.bgSecondary,
      shadowColor: theme.bgTertiary,
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowOpacity: 0.4,
      shadowRadius: 5,
      elevation: 10
    },
    buttonView: {
      paddingVertical: 32,
      paddingHorizontal: 32,
      width: '100%'
    }, collapsedContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 16,
      
    }, chevronIconHeader: {
      marginRight: 8
    },secondcontainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlignVertical: 'center',
      paddingLeft: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.divider
    },
    
    textHeader: {
      fontFamily: FF.regular,
      fontSize: FS.M,
      lineHeight: 24,
      color: theme.fontColorBase,
      textTransform: 'capitalize'
    },
    headerSelected: {
      fontFamily: FF.semiBold
    },
    tagFilterText: {
      fontSize: FS.S,
      fontFamily: FF.regular,
      lineHeight: 20,
      textTransform: 'capitalize',
      flexWrap: 'wrap',
      color: theme.bcTagFilter
    },
    tagFilterTextSelected: {
      color: theme.fontColorNegative
    },
    tagFilter: {
      borderRadius: RADIUS.M,
      borderWidth: 2,
      borderColor: theme.bcTagFilter,
      flexDirection: 'row',
      paddingHorizontal: 12,
      paddingVertical: 0,
      marginBottom: 12,
      marginRight: 12,
      height: 48,
      alignItems: 'center'
    },
    tagFilterSelected: {
      backgroundColor: theme.cTagFilterSelected,
      borderColor: theme.cTagFilterSelected
    },
    tagListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: 20,
      borderBottomColor: theme.divider,
      borderBottomWidth: 1
    }
  });



