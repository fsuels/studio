from pathlib import Path
path = Path(r'src\\components\\forms\\DynamicForm.tsx')
text = path.read_text(encoding='utf-8')
text = text.replace("  const initialValues = useMemo(() => initialData ?? {}, [initialData]);\r\n\r\n  const form = useForm({\r\n    resolver: zodResolver(validationSchema),\r\n    defaultValues: initialValues,\r\n    mode: 'onChange'\r\n  });\r\n\r\n  useEffect(() => {\r\n    form.reset(initialValues);\r\n  }, [initialValues, form]);\r\n", "  const form = useForm({\r\n    resolver: zodResolver(validationSchema),\r\n    defaultValues: initialData ?? {},\r\n    mode: 'onChange'\r\n  });\r\n\r\n  const previousInitialRef = useRef<typeof initialData>();\r\n\r\n  useEffect(() => {\r\n    if (!initialData) return;\r\n    if (previousInitialRef.current === initialData) return;\r\n\r\n    form.reset(initialData);\r\n    previousInitialRef.current = initialData;\r\n  }, [initialData, form]);\r\n")
path.write_text(text, encoding='utf-8')
