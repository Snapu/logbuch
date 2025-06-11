import { describe, it, expect, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ExerciseLogs from '../ExerciseLogs.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(ExerciseLogs, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    })
    expect(wrapper.text()).toContain(new Date().toLocaleDateString())
  })
})
