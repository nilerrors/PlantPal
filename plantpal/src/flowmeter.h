struct FlowMeter {
  volatile const uint8_t PIN;
  volatile uint32_t pulses_count;
  volatile float total_milli_litres;
  volatile bool running;
  volatile unsigned long last_running;
};
