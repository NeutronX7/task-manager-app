import '@testing-library/jest-native/extend-expect'

jest.mock('@react-navigation/native', () => {
    const actual = jest.requireActual('@react-navigation/native')
    return {
        ...actual,
        useFocusEffect: jest.fn(),
    }
})
