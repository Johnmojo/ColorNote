import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Image,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import 'react-native-get-random-values'; //UUID generate random ID
import {v4 as uuid} from 'uuid'; //UUID for item's ID

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //Main Array
      arrayData: [],

      //Store Modal toggle bool
      addNoteToggle: false,
      editNoteToggle: false,

      //Store value - Create
      taskInputTitle: '',
      taskInputHeading: '',
      storeColor: '#f3edef',
      selectedColorBox: '',

      //Store value - Edit
      editStoreColor: '#f3edef',
      buttonId: '#f3edef',

      //Store id value - Delete
      selectedItem: '', //item
      selectedItemId: '', //item.id

      //Store - Read
      editIdValue: '', //item.id
      editTitleValue: '', //item.title
      editColorValue: '', //item.color
      editHeadingValue: '', //Item.heading
      dayStamp: '', //Item's date
      daySelected: '', //Item's date
    };
  }

  //When colorBoxHandler pressed, return buttonId's value and set it to storeColor & editStoreColor
  colorBoxHandler = (event, buttonId) => {
    this.setState({
      storeColor: buttonId,
      editStoreColor: buttonId,
    });
  };

  //Deselect collor button
  colorBox = () => {
    return {
      width: 30,
      height: 30,
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
    };
  };

  //Selected collor button
  colorBoxSelect = () => {
    return {
      width: 30,
      height: 30,
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: '#ffffff',
      borderWidth: 4,
      borderRadius: 20,
    };
  };

  //Invoke and return item.id, toggle editing Modal
  rightEdit = (item) => {
    this.setState({
      editNoteToggle: true,

      //Reference for rightDelete
      selectedItem: item,
      selectedItemId: item.id,

      //Asign values to states so we can manipulate
      editIdValue: item.id,
      editTitleValue: item.title,
      editColorValue: item.color,
      editHeadingValue: item.heading,
      daySelected: item.dayRecord,
    });
  };

  //Invoke and remove Item based on Item's ID
  rightDelete = () => {
    this.setState({
      arrayData: this.state.arrayData.filter(
        (selectedItem) => selectedItem.id !== this.state.selectedItem.id,
      ),
      editNoteToggle: false,
    });
  };

  //Invoke and assigning new values to main array
  taskInputTitleHandler = () => {
    this.setState({
      arrayData: [
        ...this.state.arrayData,
        {
          id: uuid(),
          title: this.state.taskInputTitle,
          color: this.state.storeColor,
          heading: this.state.taskInputHeading,
          dayRecord: this.state.dayStamp,
        },
      ],
    }),
      this.setState({
        addNoteToggle: false,
        taskInputTitle: '',
        taskInputHeading: '',
        storeColor: '',
      });
  };

  //Invoke and update values based on Item.id
  taskEditTitleHandler = () => {
    this.setState({
      arrayData: [
        ...this.state.arrayData.map((item) =>
          item === this.state.selectedItem //If array's item.id matches with selected item.id, execute.
            ? {
                //Obtain values from TextInput's onChangeText
                id: uuid(),
                title: this.state.editTitleValue,
                color: this.state.editStoreColor,
                heading: this.state.editHeadingValue,
                dayRecord: this.state.dayStamp,
              }
            : item,
        ),
      ],
    }),
      this.setState({
        editNoteToggle: false,
      });
  };

  //Return Text to ListEmptyComponent
  introHidden = () => {
    return (
      <View style={styles.emptyList}>
        <Text style={styles.emptyListHead}>Add your first note</Text>
        <Text style={styles.emptyListPara}>
          Tap the button to start a new note
        </Text>
      </View>
    );
  };

  render() {
    //Array for Weekday
    let arrayDay = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    //Get current day as rawDay and draw from arrayDay Array
    let rawDay = new Date();
    let valueDay = arrayDay[rawDay.getDay()];
    //Get current date as valueData
    let valueDate = new Date().getDate();

    //Array for Month
    let arrayMonth = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    //Get current month as valueData
    let rawMonth = new Date();
    //Get current month as rawMonth and draw from arrayMonth Array
    let valueMonth = arrayMonth[rawMonth.getMonth()];

    //Get current year
    let valueYear = new Date().getFullYear();

    //Store current month & date
    this.state.dayStamp = valueDate + ' ' + valueMonth + ', ' + valueYear;

    return (
      <View style={styles.body}>
        <StatusBar backgroundColor="#FAFAFC" barStyle="dark-content" />
        <View style={styles.timeTabs}>
          <Text style={styles.dayDisplay}>{valueDay}</Text>
          <Text style={styles.dateMonthDisplay}>
            {/*Display current Day, date & month*/}
            {valueDate + ' ' + valueMonth}
          </Text>
        </View>

        {/*Render item from main array*/}
        <View style={styles.taskTabs}>
          <FlatList
            data={this.state.arrayData}
            ListEmptyComponent={this.introHidden()}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.rightEdit(item)}
                style={{
                  backgroundColor: item.color,
                  borderRadius: 13,
                  padding: 10,
                  marginTop: 15,
                  minHeight: 60,
                }}>
                <Text style={styles.scrollHeadTextBT}>{item.heading}</Text>
                <Text style={styles.scrollTaskTextBT}>{item.title}</Text>
                <Text style={styles.scrollRecordTextBT}>{item.dayRecord}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.LowerTouchableOpacityStyle}
          onPress={() => {
            this.setState({
              addNoteToggle: true,
            });
          }}>
          <Image
            source={require('./assets/images/addFab.png')}
            style={styles.FloatingButtonStyle}
          />
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.editNoteToggle}
          onRequestClose={() => {
            this.editNoteToggle(false);
          }}>
          <View style={styles.modalAddBorder}>
            <View style={styles.modalAddInside}>
              {/*Display item value, assign text changes back to state value*/}

              <TextInput
                value={this.state.editHeadingValue}
                onChangeText={(text) => this.setState({editHeadingValue: text})}
                placeholder={'Title'}
                autoFocus={true}
                multiline={true}
                maxLength={50}
                style={styles.inputHeadBox}
              />

              <Text style={styles.daySelectedInput}>
                {this.state.daySelected}
              </Text>

              <TextInput
                value={this.state.editTitleValue}
                onChangeText={(text) => this.setState({editTitleValue: text})}
                placeholder={'Content'}
                multiline={true}
                maxLength={250}
                placeholderStyle
                style={styles.inputContentBox}
              />

              <View style={styles.colorBoxFunction}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#00d4ff')}>
                  <Image
                    source={require('./assets/images/blueFab.png')}
                    style={
                      this.state.storeColor == '#00d4ff'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#e4ee8e')}>
                  <Image
                    source={require('./assets/images/greenFab.png')}
                    style={
                      this.state.storeColor == '#e4ee8e'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#ff9b73')}>
                  <Image
                    source={require('./assets/images/redFab.png')}
                    style={
                      this.state.storeColor == '#ff9b73'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#ffc874')}>
                  <Image
                    source={require('./assets/images/yellowFab.png')}
                    style={
                      this.state.storeColor == '#ffc874'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#b892ff')}>
                  <Image
                    source={require('./assets/images/pinkFab.png')}
                    style={
                      this.state.storeColor == '#b892ff'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#f2ecee')}>
                  <Image
                    source={require('./assets/images/greyFab.png')}
                    style={
                      this.state.storeColor == '#f2ecee'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.deleteNoteFunction}
                onPress={() => this.rightDelete()}>
                <Image
                  source={require('./assets/images/deleteFab.png')}
                  style={styles.FloatingButtonStyle}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.cancelNoteFunction}
                onPress={() => {
                  this.setState({
                    editNoteToggle: false,
                  });
                }}>
                <Image
                  source={require('./assets/images/closeFab.png')}
                  style={styles.FloatingButtonStyle}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.addNoteFunction}
                onPress={this.taskEditTitleHandler}>
                <Image
                  source={require('./assets/images/checkFab.png')}
                  style={styles.FloatingButtonStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.addNoteToggle}
          onRequestClose={() => {
            this.addNoteToggle(false);
          }}>
          <View style={styles.modalAddBorder}>
            <View style={styles.modalAddInside}>
              {/*Assign value back to state*/}
              <TextInput
                onChangeText={(text) => {
                  this.setState({
                    taskInputHeading: text,
                  });
                }}
                value={this.state.taskInputHeading}
                placeholder={'Title'}
                autoFocus={true}
                multiline={true}
                maxLength={50}
                style={styles.inputHeadBox}
              />

              <TextInput
                onChangeText={(text) => {
                  this.setState({
                    taskInputTitle: text,
                  });
                }}
                value={this.state.taskInputTitle}
                placeholder={'Content'}
                multiline={true}
                maxLength={400}
                style={styles.inputContentBox}
              />

              <View style={styles.colorBoxFunction}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#00d4ff')}>
                  <Image
                    source={require('./assets/images/blueFab.png')}
                    style={
                      this.state.storeColor == '#00d4ff'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#e4ee8e')}>
                  <Image
                    source={require('./assets/images/greenFab.png')}
                    style={
                      this.state.storeColor == '#e4ee8e'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#ff9b73')}>
                  <Image
                    source={require('./assets/images/redFab.png')}
                    style={
                      this.state.storeColor == '#ff9b73'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#ffc874')}>
                  <Image
                    source={require('./assets/images/yellowFab.png')}
                    style={
                      this.state.storeColor == '#ffc874'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#b892ff')}>
                  <Image
                    source={require('./assets/images/pinkFab.png')}
                    style={
                      this.state.storeColor == '#b892ff'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={(event) => this.colorBoxHandler(event, '#f2ecee')}>
                  <Image
                    source={require('./assets/images/greyFab.png')}
                    style={
                      this.state.storeColor == '#f2ecee'
                        ? this.colorBoxSelect()
                        : this.colorBox()
                    }
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.cancelNoteFunction}
                onPress={() => {
                  this.setState({
                    addNoteToggle: false,
                  });
                }}>
                <Image
                  source={require('./assets/images/closeFab.png')}
                  style={styles.FloatingButtonStyle}
                />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.addNoteFunction}
                onPress={this.taskInputTitleHandler}>
                <Image
                  source={require('./assets/images/checkFab.png')}
                  style={styles.FloatingButtonStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

//Stylesheet
const styles = StyleSheet.create({
  scrollHeadTextBT: {
    color: '#3d3d3d',
    fontFamily: 'DMSans-Bold',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
    textAlign: 'left',
  },

  scrollTaskTextBT: {
    color: '#3d3d3d',
    fontFamily: 'OpenSans-SemiBold',
    fontWeight: 'normal',
    fontSize: 14,
    lineHeight: 25,
    padding: 10,
    textAlign: 'left',
  },

  scrollRecordTextBT: {
    color: '#3d3d3d',
    fontFamily: 'DMSans-Bold',
    fontWeight: 'normal',
    fontSize: 12,
    lineHeight: 25,
    padding: 10,
    textAlign: 'left',
  },

  daySelectedInput: {
    color: '#a6a6a6',
    fontFamily: 'DMSans-Bold',
    fontWeight: 'normal',
    fontSize: 15,
    lineHeight: 25,
    padding: 10,
    textAlign: 'left',
  },

  emptyList: {
    height: 500,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyListHead: {
    color: '#3d3d3d',
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
    textAlign: 'center',
  },

  emptyListPara: {
    color: '#a6a6a6',
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    textAlign: 'center',
  },

  colorBoxFunction: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  inputHeadBox: {
    borderWidth: 1,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 20,
    textAlignVertical: 'top',
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
  },

  inputContentBox: {
    borderWidth: 1,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 5,
    paddingLeft: 10,
    paddingTop: 20,
    paddingBottom: 20,
    textAlignVertical: 'top',
    lineHeight: 30,
    fontFamily: 'OpenSans-SemiBold',
    fontWeight: 'normal',
    fontSize: 15,
  },

  addNoteFunction: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  cancelNoteFunction: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 90,
    bottom: 30,
  },

  deleteNoteFunction: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 150,
    bottom: 30,
  },

  modalAddBorder: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(240, 240, 240, 0.5)',
  },

  modalAddInside: {
    backgroundColor: '#ffffff',
    height: '100%',
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 50,
  },

  body: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FAFAFC',
  },

  timeTabs: {
    flex: 1,
    fontSize: 20,
    margin: 20,
    fontWeight: 'bold',
    maxHeight: 50,
  },

  taskTabs: {
    flex: 2,
    fontSize: 20,
    textAlign: 'center',
    marginLeft: 10,
    marginRight: 10,
    padding: 5,
    fontWeight: 'bold',
  },

  FloatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },

  LowerTouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },

  dayDisplay: {
    color: '#3d3d3d',
    fontFamily: 'DMSans-Bold',
    fontSize: 22,
  },

  dateMonthDisplay: {
    textAlign: 'left',
    color: '#a6a6a6',
    fontSize: 16,
    fontFamily: 'DMSans-Regular',
  },
});
