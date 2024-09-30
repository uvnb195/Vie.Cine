import SearchInput from "../SearchInput"
import { render } from '@testing-library/react-native'

describe('<SearchInput/>', () => {
    test("Render correctly", () => {
        const { getByText } = render(<SearchInput />)

        getByText("Hello Testing World!")
    })
})