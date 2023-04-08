import React, { Suspense, useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, Touchable } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { makeCall } from 'utils';

import { doFetch, navigate, useAccessibilityAutoFocus, useAuth } from '@client/common';
import { Button } from '@client/ui-components/src/components/Button';
import { useTheme, BuildStyles } from '@client/ui-components/src/utils';

import { RouteParams } from '../routes';
import { Checkbox, Loading } from '@client/ui-components/src/components';

import { TouchableOpacity } from 'react-native-gesture-handler';

import { FF, FS, RADIUS } from '@client/ui-components/src/theme/global';
import { da } from 'date-fns/locale';

const ChooseQuarter = () => {const { theme, role, constants } = useTheme();
const [areQuartersVisible, setQuartersVisible] = useState(false);
const [District, setDistrict] = useState("");
const [id, setiD] = useState({});
const styles = buildStyles({ theme });
const user = useAuth((state) => state.user);
const { accessibility } = useAccessibilityAutoFocus();

const data = useRoute().params;
const Quarters = [...[data]];
const barrio = [{codigo: 99, nombre:"Test",quarters:[{id: 102, nombre:"PIVONERA",  distrito:16}]}];
const barrios2 = () =>{
    
   
    const barrio3 = [...barrio,...Quarters]
    barrio3.splice(0,1)
    return barrio3;
};
const  Distrito= () =>{
    
   
    const barrio3 = [...Quarters]
    
    return barrio3;
};

const distrito = Distrito();
console.log(distrito[0].nombre);

const barriofinal = [...barrios2()]
const Barrios = barriofinal.map(user => (user.quarters))
const pepito = [{id: 102, nombre:"PIVONERA",  distrito:16}];
const totalbarrios = Barrios.forEach(element => {
    element.forEach((element2: any) => {
         pepito.push(element2);
    });
});
const barrios3 = () =>{
    const barrio3 = [...pepito]
    barrio3.splice(0,1)
    return barrio3;
};
const FINALES = barrios3();

const navigation =
  useNavigation<StackNavigationProp<RouteParams, 'ChooseQuarter'>>();

  const routeChange = (params : Object) =>{ 
    let path = `Step3Digital`; 
    navigate(path,params);
  }
  


  return (
<View style={styles.container}>
      <FlatList
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 16 }}
        data={FINALES}
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
                label: `Distrito ${item}. Barrios seleccionados:v `,
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
        keyExtractor={(item, index) => `${item.id.toString()}_${index}`}
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
            const params = {distrito:distrito,barrio:District}
            routeChange(params);
          
          }}
        />
      </View>
    </View>
  );
};
const ChooseDistrict = () => (
  <Suspense fallback={<Loading />}>
    <ChooseQuarter />
  </Suspense>
);


export default ChooseQuarter;


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



